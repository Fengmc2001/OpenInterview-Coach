#!/usr/bin/env python3
"""Generate question and example-answer MP3 files with the OpenAI Speech API.

The API key is accepted only from ``OPENAI_API_KEY`` in the process environment
or from an untracked repository-root ``.env`` file. The generator is
incremental: a clip is reused only when both its source hash and file hash match
the audio manifest.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import tempfile
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CONTENT = ROOT / "content" / "questions.json"
DEFAULT_AUDIO_DIR = ROOT / "public" / "audio"
MANIFEST_VERSION = 1
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,63}$")
LOCALE_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9-]{1,63}$")


@dataclass(frozen=True)
class Clip:
    deck_id: str
    locale: str
    question_id: str
    kind: str
    text: str

    @property
    def filename(self) -> str:
        suffix = "" if self.kind == "question" else "-a"
        return f"{self.question_id}{suffix}.mp3"

    @property
    def relative_path(self) -> str:
        return f"{self.deck_id}/{self.filename}"


def eprint(*values: object) -> None:
    print(*values, file=sys.stderr)


def load_dotenv(path: Path) -> None:
    """Load a minimal .env syntax without printing or overwriting environment."""
    if not path.is_file():
        return
    for line_number, raw_line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[7:].lstrip()
        if "=" not in line:
            raise ValueError(f"Invalid .env entry at line {line_number}")
        key, value = line.split("=", 1)
        key = key.strip()
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", key):
            raise ValueError(f"Invalid .env variable name at line {line_number}")
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        os.environ.setdefault(key, value)


def read_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValueError(f"Content file not found: {path}") from exc
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in {path}: {exc}") from exc


def pick_text(record: dict[str, Any], names: Iterable[str]) -> str:
    for name in names:
        value = record.get(name)
        if isinstance(value, str) and value.strip():
            return value.strip()
    return ""


def normalize_decks(payload: Any) -> list[dict[str, Any]]:
    if not isinstance(payload, dict):
        raise ValueError("Content root must be a JSON object")

    if isinstance(payload.get("questions"), list):
        grouped: dict[str, list[dict[str, Any]]] = {}
        for question in payload["questions"]:
            if not isinstance(question, dict):
                raise ValueError("Every question must be a JSON object")
            locale = question.get("locale")
            if not isinstance(locale, str) or not locale:
                raise ValueError("Flat questions must include a locale")
            grouped.setdefault(locale, []).append(question)
        return [{"locale": locale, "questions": questions} for locale, questions in grouped.items()]

    collections = payload.get("locales") or payload.get("sets") or payload.get("decks")
    if isinstance(collections, dict):
        decks = []
        for locale, deck in collections.items():
            if not isinstance(deck, dict):
                raise ValueError(f"Deck {locale!r} must be a JSON object")
            decks.append({**deck, "locale": deck.get("locale") or locale})
        return decks
    if isinstance(collections, list):
        return collections
    raise ValueError("Expected a top-level locales, sets, decks, or questions collection")


def collect_clips(payload: Any, locale_filter: set[str], id_filter: set[str]) -> list[Clip]:
    clips: list[Clip] = []
    seen_ids: set[str] = set()
    for deck_index, deck in enumerate(normalize_decks(payload), 1):
        if not isinstance(deck, dict):
            raise ValueError(f"Deck {deck_index} must be a JSON object")
        deck_id = deck.get("id") or deck.get("locale") or deck.get("language")
        locale = deck.get("locale") or deck_id
        if not isinstance(deck_id, str) or not ID_RE.fullmatch(deck_id):
            raise ValueError(f"Deck {deck_index} has an unsafe id: {deck_id!r}")
        if not isinstance(locale, str) or not LOCALE_RE.fullmatch(locale):
            raise ValueError(f"Deck {deck_id!r} has an unsafe locale: {locale!r}")
        if locale_filter and deck_id not in locale_filter and locale not in locale_filter:
            continue
        questions = deck.get("questions")
        if not isinstance(questions, list) or not questions:
            raise ValueError(f"Deck {locale!r} must contain a non-empty questions array")
        for question_index, question in enumerate(questions, 1):
            if not isinstance(question, dict):
                raise ValueError(f"Question {question_index} in {locale!r} must be an object")
            question_id = question.get("id")
            if not isinstance(question_id, str) or not ID_RE.fullmatch(question_id):
                raise ValueError(f"Question {question_index} in {locale!r} has an unsafe id")
            if question_id in seen_ids:
                raise ValueError(f"Duplicate question id: {question_id}")
            seen_ids.add(question_id)
            if id_filter and question_id not in id_filter:
                continue
            question_text = pick_text(question, ("question", "prompt", "text"))
            answer_text = pick_text(question, ("answer", "sampleAnswer", "exampleAnswer", "modelAnswer"))
            if not question_text or not answer_text:
                raise ValueError(f"Question {question_id!r} must contain question and answer text")
            clips.append(Clip(deck_id, locale, question_id, "question", question_text))
            clips.append(Clip(deck_id, locale, question_id, "answer", answer_text))
    if not clips:
        raise ValueError("No clips matched the requested filters")
    return clips


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def source_hash(clip: Clip, model: str, voice: str, speed: float, instructions: str) -> str:
    source = {
        "kind": clip.kind,
        "deckId": clip.deck_id,
        "locale": clip.locale,
        "model": model,
        "speed": speed,
        "text": clip.text,
        "voice": voice,
        "instructions": instructions,
    }
    encoded = json.dumps(source, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return sha256_bytes(encoded)


def speech_instructions(clip: Clip) -> str:
    language_names = {
        "ja": "Japanese",
        "ja-jp": "Japanese",
        "en": "English",
        "en-us": "English",
        "zh": "Mandarin Chinese",
        "zh-cn": "Mandarin Chinese",
    }
    language = language_names.get(clip.locale.lower(), clip.locale)
    if clip.kind == "question":
        return (
            f"Speak in natural {language} as a calm, professional interviewer. "
            "Use clear articulation, a measured pace, and a brief natural pause at punctuation."
        )
    return (
        f"Speak in natural {language} as a thoughtful interview candidate. "
        "Sound confident but not theatrical, with clear articulation and natural pauses."
    )


def request_speech(api_key: str, endpoint: str, payload: dict[str, Any], retries: int) -> bytes:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    for attempt in range(retries + 1):
        request = urllib.request.Request(
            endpoint,
            data=body,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "OpenInterview-Coach-audio-generator/1",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=180) as response:
                data = response.read()
                if not data:
                    raise RuntimeError("The Speech API returned an empty response")
                if not (data.startswith(b"ID3") or (len(data) > 1 and data[0] == 0xFF and data[1] & 0xE0 == 0xE0)):
                    raise RuntimeError("The Speech API response is not an MP3 file")
                return data
        except urllib.error.HTTPError as exc:
            detail = exc.read(2048).decode("utf-8", errors="replace")
            retryable = exc.code in {408, 409, 429, 500, 502, 503, 504}
            if attempt >= retries or not retryable:
                raise RuntimeError(f"Speech API request failed ({exc.code}): {detail}") from exc
        except (urllib.error.URLError, TimeoutError) as exc:
            if attempt >= retries:
                raise RuntimeError(f"Speech API request failed: {exc}") from exc
        time.sleep(min(2**attempt, 8))
    raise AssertionError("unreachable")


def load_manifest(path: Path) -> dict[str, Any]:
    if not path.is_file():
        return {"schemaVersion": MANIFEST_VERSION, "clips": {}}
    value = read_json(path)
    if not isinstance(value, dict) or not isinstance(value.get("clips"), dict):
        raise ValueError(f"Invalid audio manifest: {path}")
    return value


def write_json_atomic(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    serialized = json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    with tempfile.NamedTemporaryFile(
        "w", encoding="utf-8", dir=path.parent, prefix=".tmp-", suffix=".tmp", delete=False
    ) as handle:
        handle.write(serialized)
        temporary = Path(handle.name)
    temporary.replace(path)


def write_bytes_atomic(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("wb", dir=path.parent, prefix=".tmp-", suffix=".tmp", delete=False) as handle:
        handle.write(data)
        temporary = Path(handle.name)
    temporary.replace(path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--content", type=Path, default=DEFAULT_CONTENT)
    parser.add_argument("--audio-dir", type=Path, default=DEFAULT_AUDIO_DIR)
    parser.add_argument("--model", default=os.environ.get("OPENAI_TTS_MODEL", "gpt-4o-mini-tts"))
    parser.add_argument("--voice", default=os.environ.get("OPENAI_TTS_VOICE", "cedar"))
    parser.add_argument("--speed", type=float, default=float(os.environ.get("OPENAI_TTS_SPEED", "1.0")))
    parser.add_argument("--locale", action="append", default=[], help="Generate only this locale; repeatable")
    parser.add_argument("--id", action="append", default=[], help="Generate only this question id; repeatable")
    parser.add_argument("--questions-only", action="store_true")
    parser.add_argument("--answers-only", action="store_true")
    parser.add_argument("--force", action="store_true", help="Regenerate clips even when hashes match")
    parser.add_argument("--dry-run", action="store_true", help="Report work without calling the API")
    parser.add_argument("--retries", type=int, default=3)
    parser.add_argument("--endpoint", default="https://api.openai.com/v1/audio/speech", help=argparse.SUPPRESS)
    args = parser.parse_args()
    if args.questions_only and args.answers_only:
        parser.error("--questions-only and --answers-only are mutually exclusive")
    if not 0.25 <= args.speed <= 4.0:
        parser.error("--speed must be between 0.25 and 4.0")
    if args.retries < 0 or args.retries > 10:
        parser.error("--retries must be between 0 and 10")
    return args


def main() -> int:
    try:
        load_dotenv(ROOT / ".env")
        args = parse_args()
        payload = read_json(args.content.resolve())
        clips = collect_clips(payload, set(args.locale), set(args.id))
        if args.questions_only:
            clips = [clip for clip in clips if clip.kind == "question"]
        elif args.answers_only:
            clips = [clip for clip in clips if clip.kind == "answer"]

        api_key = os.environ.get("OPENAI_API_KEY", "").strip()
        if not args.dry_run and not api_key:
            raise ValueError(
                "OPENAI_API_KEY is required. Set it in the environment or an untracked repository-root .env file."
            )

        audio_dir = args.audio_dir.resolve()
        manifest_path = audio_dir / "manifest.json"
        manifest = load_manifest(manifest_path)
        old_entries = manifest.get("clips", {})
        entries: dict[str, Any] = dict(old_entries)
        generated = 0
        reused = 0

        for index, clip in enumerate(clips, 1):
            instructions = speech_instructions(clip)
            expected_source_hash = source_hash(clip, args.model, args.voice, args.speed, instructions)
            output_path = audio_dir / clip.relative_path
            previous = old_entries.get(clip.relative_path)
            reusable = (
                not args.force
                and isinstance(previous, dict)
                and previous.get("sourceSha256") == expected_source_hash
                and output_path.is_file()
                and previous.get("fileSha256") == sha256_file(output_path)
            )
            if reusable:
                reused += 1
                print(f"[{index}/{len(clips)}] reuse {clip.relative_path}")
                continue

            print(f"[{index}/{len(clips)}] {'would generate' if args.dry_run else 'generate'} {clip.relative_path}")
            if args.dry_run:
                generated += 1
                continue
            audio = request_speech(
                api_key,
                args.endpoint,
                {
                    "model": args.model,
                    "voice": args.voice,
                    "input": clip.text,
                    "instructions": instructions,
                    "response_format": "mp3",
                    "speed": args.speed,
                },
                args.retries,
            )
            write_bytes_atomic(output_path, audio)
            entries[clip.relative_path] = {
                "characters": len(clip.text),
                "fileSha256": sha256_file(output_path),
                "id": clip.question_id,
                "kind": clip.kind,
                "deckId": clip.deck_id,
                "locale": clip.locale,
                "model": args.model,
                "sourceSha256": expected_source_hash,
                "speed": args.speed,
                "voice": args.voice,
            }
            generated += 1

        if not args.dry_run:
            active_paths = {clip.relative_path for clip in collect_clips(payload, set(), set())}
            entries = {key: value for key, value in entries.items() if key in active_paths}
            manifest_changed = (
                generated > 0
                or entries != old_entries
                or manifest.get("schemaVersion") != MANIFEST_VERSION
                or manifest.get("generatedBy") != "scripts/generate_audio.py"
            )
            if manifest_changed:
                write_json_atomic(
                    manifest_path,
                    {
                        "schemaVersion": MANIFEST_VERSION,
                        "generatedBy": "scripts/generate_audio.py",
                        "updatedAt": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
                        "clips": entries,
                    },
                )
        print(f"Audio generation complete: {generated} generated, {reused} reused, {len(clips)} selected.")
        return 0
    except (OSError, ValueError, RuntimeError) as exc:
        eprint(f"ERROR: {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
