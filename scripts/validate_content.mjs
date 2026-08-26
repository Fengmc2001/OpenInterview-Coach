#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

const ROOT = resolve(import.meta.dirname, '..');
const ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,63}$/;
const LOCALE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9-]{1,63}$/;

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

function parseArguments() {
  const args = process.argv.slice(2);
  const options = {
    content: resolve(ROOT, 'content/questions.json'),
    audioDir: resolve(ROOT, 'public/audio'),
    requireAudio: false,
  };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--require-audio') {
      options.requireAudio = true;
    } else if (argument === '--content' && args[index + 1]) {
      options.content = resolve(args[++index]);
    } else if (argument === '--audio-dir' && args[index + 1]) {
      options.audioDir = resolve(args[++index]);
    } else {
      throw new Error(`Unknown or incomplete argument: ${argument}`);
    }
  }
  return options;
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read valid JSON from ${path}: ${error.message}`);
  }
}

function normalizeDecks(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Content root must be a JSON object.');
  }

  if (Array.isArray(payload.questions)) {
    const grouped = new Map();
    for (const question of payload.questions) {
      const locale = question && typeof question === 'object' ? question.locale : undefined;
      if (typeof locale !== 'string' || !locale) {
        throw new Error('Every flat question must include a locale.');
      }
      if (!grouped.has(locale)) grouped.set(locale, []);
      grouped.get(locale).push(question);
    }
    return [...grouped].map(([locale, questions]) => ({ locale, questions }));
  }

  const collection = payload.locales ?? payload.sets ?? payload.decks;
  if (Array.isArray(collection)) return collection;
  if (collection && typeof collection === 'object') {
    return Object.entries(collection).map(([locale, deck]) => ({
      ...(deck && typeof deck === 'object' ? deck : {}),
      locale: deck?.locale ?? locale,
    }));
  }
  throw new Error('Expected a top-level locales, sets, decks, or questions collection.');
}

function firstText(record, fields) {
  for (const field of fields) {
    if (typeof record[field] === 'string' && record[field].trim()) return record[field].trim();
  }
  return '';
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function validateText(text, label, minimum, maximum) {
  if (text.length < minimum) fail(`${label} is too short (minimum ${minimum} characters).`);
  if (text.length > maximum) fail(`${label} is too long (maximum ${maximum} characters).`);
  if (/<script\b|javascript\s*:/iu.test(text)) fail(`${label} contains executable markup.`);
  if (/\u0000/u.test(text)) fail(`${label} contains a NUL character.`);
}

function main() {
  const options = parseArguments();
  const payload = readJson(options.content);
  const decks = normalizeDecks(payload);
  if (decks.length === 0) throw new Error('At least one locale deck is required.');

  const seenLocales = new Set();
  const seenDeckIds = new Set();
  const seenIds = new Set();
  const clips = [];
  let questionCount = 0;

  decks.forEach((deck, deckIndex) => {
    if (!deck || typeof deck !== 'object' || Array.isArray(deck)) {
      fail(`Deck ${deckIndex + 1} must be an object.`);
      return;
    }
    const deckId = deck.id ?? deck.locale ?? deck.language;
    const locale = deck.locale ?? deckId;
    if (typeof deckId !== 'string' || !ID_PATTERN.test(deckId)) {
      fail(`Deck ${deckIndex + 1} has an unsafe id: ${JSON.stringify(deckId)}.`);
      return;
    }
    if (typeof locale !== 'string' || !LOCALE_PATTERN.test(locale)) {
      fail(`Deck ${deckId} has an unsafe locale: ${JSON.stringify(locale)}.`);
      return;
    }
    if (seenDeckIds.has(deckId)) fail(`Duplicate deck id: ${deckId}.`);
    seenDeckIds.add(deckId);
    if (seenLocales.has(locale)) fail(`Duplicate locale deck: ${locale}.`);
    seenLocales.add(locale);
    if (!Array.isArray(deck.questions) || deck.questions.length === 0) {
      fail(`Deck ${locale} must contain a non-empty questions array.`);
      return;
    }
    if (typeof deck.title === 'string') validateText(deck.title.trim(), `Deck ${locale} title`, 1, 120);

    deck.questions.forEach((question, questionIndex) => {
      const location = `${locale} question ${questionIndex + 1}`;
      if (!question || typeof question !== 'object' || Array.isArray(question)) {
        fail(`${location} must be an object.`);
        return;
      }
      const id = question.id;
      if (typeof id !== 'string' || !ID_PATTERN.test(id)) {
        fail(`${location} has an unsafe id: ${JSON.stringify(id)}.`);
        return;
      }
      if (seenIds.has(id)) fail(`Question id must be globally unique: ${id}.`);
      seenIds.add(id);

      const prompt = firstText(question, ['question', 'prompt', 'text']);
      const answer = firstText(question, ['answer', 'sampleAnswer', 'exampleAnswer', 'modelAnswer']);
      if (!prompt) fail(`${location} (${id}) is missing question text.`);
      if (!answer) fail(`${location} (${id}) is missing example-answer text.`);
      if (prompt) validateText(prompt, `${location} prompt`, 4, 1_500);
      if (answer) validateText(answer, `${location} answer`, 8, 4_000);
      if (question.category !== undefined) {
        if (typeof question.category !== 'string' || !question.category.trim()) {
          fail(`${location} category must be a non-empty string.`);
        } else {
          validateText(question.category.trim(), `${location} category`, 1, 80);
        }
      }

      clips.push(`${deckId}/${id}.mp3`, `${deckId}/${id}-a.mp3`);
      questionCount += 1;
    });
  });

  if (questionCount === 0) fail('At least one valid question is required.');

  if (options.requireAudio) {
    const manifestPath = resolve(options.audioDir, 'manifest.json');
    if (!existsSync(manifestPath)) {
      fail(`Audio manifest is missing: ${manifestPath}.`);
    } else {
      const manifest = readJson(manifestPath);
      if (manifest.schemaVersion !== 1 || !manifest.clips || typeof manifest.clips !== 'object') {
        fail('Audio manifest must use schemaVersion 1 and contain a clips object.');
      } else {
        for (const clip of clips) {
          const audioPath = resolve(options.audioDir, clip);
          const entry = manifest.clips[clip];
          if (!existsSync(audioPath)) {
            fail(`Required audio file is missing: ${clip}.`);
            continue;
          }
          if (statSync(audioPath).size < 512) fail(`Audio file is unexpectedly small: ${clip}.`);
          if (!entry || typeof entry !== 'object') {
            fail(`Audio manifest entry is missing: ${clip}.`);
            continue;
          }
          if (!/^[a-f0-9]{64}$/u.test(entry.fileSha256 ?? '')) {
            fail(`Audio manifest has an invalid file hash: ${clip}.`);
          } else if (entry.fileSha256 !== sha256(audioPath)) {
            fail(`Audio file hash does not match the manifest: ${clip}.`);
          }
          if (!/^[a-f0-9]{64}$/u.test(entry.sourceSha256 ?? '')) {
            fail(`Audio manifest has an invalid source hash: ${clip}.`);
          }
        }
        for (const manifestClip of Object.keys(manifest.clips)) {
          if (!clips.includes(manifestClip)) fail(`Audio manifest contains an orphaned clip: ${manifestClip}.`);
        }
      }
    }
  }

  if (process.exitCode) return;
  console.log(
    `Content validation passed: ${decks.length} locale decks, ${questionCount} questions, ${clips.length} expected audio clips${options.requireAudio ? ' verified' : ''}.`,
  );
}

try {
  main();
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
