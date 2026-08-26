# OpenInterview Coach / 开放面试练习 / オープン面接練習

**English.** OpenInterview Coach is a reusable interview-practice website built around question cards, sample answers, and recorded audio. The demo includes Japanese, English, and Simplified Chinese, but the same layout works for other languages and interview formats.

**简体中文。** OpenInterview Coach 是一个可复用的面试练习网站，以问题卡片、参考回答和配套音频为核心。演示题库包含日语、英语和简体中文，但这套结构同样可以用于其他语言和不同类型的面试。

**日本語。** OpenInterview Coach は、質問カード、回答例、音声を使って練習できる再利用可能な面接サイトです。デモには日本語・英語・簡体字中国語が含まれていますが、同じ画面構成をほかの言語や面接形式にも利用できます。

## Live demo / 在线演示 / デモサイト

**English.** Open the GitHub Pages demo at [fengmc2001.github.io/OpenInterview-Coach](https://fengmc2001.github.io/OpenInterview-Coach/). It is the same practice interface used by the project build, not a separate landing page.

**简体中文。** GitHub Pages 在线演示位于 [fengmc2001.github.io/OpenInterview-Coach](https://fengmc2001.github.io/OpenInterview-Coach/)。演示页直接使用本项目的练习界面，不是另外制作的介绍页。

**日本語。** GitHub Pages 版は [fengmc2001.github.io/OpenInterview-Coach](https://fengmc2001.github.io/OpenInterview-Coach/) で試せます。別に作った紹介ページではなく、プロジェクト本体と同じ練習画面です。

## How the practice screen works / 练习界面如何使用 / 練習画面の使い方

**English.** The first tab is the main shadowing view. Every card keeps the question and sample answer on screen together. The centre button plays the question, pauses briefly, then plays the answer. The other controls play only the answer, rewind three seconds, stop, or continue automatically to the next card. Playback speed, repetition count, and the practice gap are adjustable.

**简体中文。** 第一个选项卡是主要的跟读界面。每张卡片会同时显示问题和参考回答。中间的播放键会先读问题，短暂停顿后再读回答；其余按钮可以只听回答、快退三秒、停止，或在播放结束后自动进入下一题。语速、重复次数和跟读间隔都可以调整。

**日本語。** 最初のタブがメインのシャドーイング画面です。各カードには質問と回答例が同時に表示されます。中央のボタンは質問を読み、短い間を置いてから回答例を再生します。ほかのボタンでは、回答だけの再生、3 秒戻し、停止、次のカードへの連続再生ができます。速度、繰り返し回数、練習間隔も変更できます。

**English.** The interview tab shuffles either the current language or all three decks. You can replay a question, reveal the sample answer, record a response, download a take, and use live speech recognition in a supported browser. The guide tab breaks common questions into the interviewer's intent, a practical answer order, and short speaking notes.

**简体中文。** 模拟面试选项卡可以从当前语言或全部三套题库中随机抽题。你可以重听问题、查看参考回答、录制自己的回答并下载录音；在支持的浏览器中还可以打开实时语音识别。回答思路选项卡会说明常见问题的考察意图、回答顺序和表达要点。

**日本語。** 模擬面接タブでは、現在の言語または 3 言語すべてから質問をランダムに出題します。質問の再生、回答例の表示、自分の回答の録音と保存ができ、対応ブラウザーではリアルタイム音声認識も使えます。回答ガイドには、質問の意図、答える順番、話すときのポイントをまとめています。

## What the template includes / 模板包含什么 / テンプレートの内容

- **English.** Twenty-seven sample questions: nine each in Japanese, English, and Simplified Chinese.<br>**简体中文.** 共 27 道示例问题：日语、英语和简体中文各 9 道。<br>**日本語.** 日本語・英語・簡体字中国語を各 9 問、合計 27 問のサンプル質問。
- **English.** One question MP3 and one answer MP3 for every card, for a total of fifty-four clips.<br>**简体中文.** 每道题都配有问题音频和回答音频，共 54 段 MP3。<br>**日本語.** 各カードに質問音声と回答音声を 1 本ずつ用意した、合計 54 本の MP3。
- **English.** The same full-height, retro academic interface on desktop and mobile screens.<br>**简体中文.** 桌面与移动设备共用同一套全屏复古学术风格界面。<br>**日本語.** デスクトップとモバイルで共通する、全画面のレトロな学術調インターフェース。
- **English.** Shadowing, mock-interview, recording, live-transcript, answer-guide, playback, and browser-voice fallback features.<br>**简体中文.** 跟读、模拟面试、录音、实时字幕、回答思路、音频控制和浏览器语音备用功能。<br>**日本語.** シャドーイング、模擬面接、録音、リアルタイム字幕、回答ガイド、再生操作、ブラウザー音声フォールバック。

## Project structure / 项目构成 / プロジェクト構成

```text
app/
  coach.tsx                 Shared Sites and Pages presentation wrapper
  globals.css               Full-viewport wrapper styles
content/
  questions.json            Editable decks, questions, and sample answers
  guide.json                Editable answer-guide content
public/
  coach.html                Complete interview interface and playback logic
  data/                     Browser-ready data generated from content/
  audio/
    manifest.json
    ja/  en/  zh/           Question and answer MP3 files
github-pages/
  index.html
  main.tsx                  GitHub Pages entry
scripts/
  export_browser_data.mjs   Builds browser data from the editable JSON
  generate_audio.py         Generates audio with the OpenAI API
  validate_content.mjs      Checks IDs, text, and audio files
.github/workflows/
  ci.yml
  pages.yml                 Tests and publishes the GitHub Pages build
```

**English.** Edit the JSON files under `content/`. `npm run content:export` turns them into the small browser scripts loaded by `public/coach.html`. Both deployment adapters show that same document, so GitHub Pages and ChatGPT Sites keep the same layout and behaviour.

**简体中文.** 日常修改只需要编辑 `content/` 下的 JSON 文件。`npm run content:export` 会把它们转换成 `public/coach.html` 读取的浏览器脚本。两种部署方式都展示同一份页面，因此 GitHub Pages 与 ChatGPT Sites 的外观和操作会保持一致。

**日本語.** 通常は `content/` 以下の JSON ファイルを編集します。`npm run content:export` により、`public/coach.html` が読み込むブラウザー用スクリプトへ変換されます。2 つのデプロイ先は同じページを表示するため、GitHub Pages と ChatGPT Sites で見た目と操作が一致します。

## Run it locally / 在本地运行 / ローカルで実行する

**English.** Install Git, Node.js 22.13 or later, and npm. Python 3 is needed only when you want to generate new audio.

**简体中文.** 请先安装 Git、Node.js 22.13 或更高版本以及 npm。只有生成新音频时才需要 Python 3。

**日本語.** Git、Node.js 22.13 以降、npm を用意してください。Python 3 が必要なのは、新しい音声を生成する場合だけです。

```bash
git clone https://github.com/Fengmc2001/OpenInterview-Coach.git
cd OpenInterview-Coach
npm install
npm run dev
```

**English.** Open the local address printed in the terminal. The included questions and MP3 files work immediately; an API key is not needed to run the site or practise with it.

**简体中文.** 打开终端中显示的本地地址即可使用。内置题库和 MP3 可以直接播放，运行网站或进行练习不需要 API Key。

**日本語.** ターミナルに表示されたローカル URL を開いてください。同梱の質問と MP3 はそのまま利用でき、サイトの起動や練習に API キーは必要ありません。

## Edit questions and answers / 编辑问题与回答 / 質問と回答を編集する

**English.** Add or edit decks in `content/questions.json`. Keep every question ID unique and stable: the ID connects a card to its question and answer audio files. After an edit, export the browser data and validate the result.

**简体中文.** 请在 `content/questions.json` 中添加或修改题库。每个问题 ID 都必须唯一并保持稳定，因为网页会通过 ID 关联卡片、问题音频和回答音频。编辑完成后，请重新导出浏览器数据并进行校验。

**日本語.** `content/questions.json` でデッキを追加・編集します。質問 ID は一意にし、後から変更しないでください。カード、質問音声、回答音声は ID で結び付いています。編集後はブラウザー用データを再生成し、検証します。

```json
{
  "id": "en-01",
  "category": "motivation",
  "question": "Why did you choose this program?",
  "answer": "I chose it because..."
}
```

```bash
npm run content:export
npm run validate
```

**English.** The answer guide lives in `content/guide.json`. Its chapters, common question wording, interview intent, answer order, and speaking notes can all be replaced without changing the interface.

**简体中文.** 回答思路页面的内容位于 `content/guide.json`。章节、常见问法、考察意图、回答顺序和表达要点都可以直接替换，无需改动界面代码。

**日本語.** 回答ガイドの内容は `content/guide.json` にあります。章、よくある聞き方、質問の意図、回答順序、話し方のメモは、画面コードを変更せずに差し替えられます。

## Configure the OpenAI API key / 配置 OpenAI API Key / OpenAI API キーの設定

**English.** The API key is used only by the local audio generator. Copy the example file and add a key created in your own OpenAI account.

**简体中文.** API Key 只由本地音频生成脚本使用。先复制示例文件，再填入你在自己的 OpenAI 账户中创建的密钥。

**日本語.** API キーを使用するのはローカル音声生成ツールだけです。サンプルファイルをコピーし、自分の OpenAI アカウントで作成したキーを設定します。

```bash
cp .env.example .env
```

```dotenv
OPENAI_API_KEY=replace_with_your_own_key
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_TTS_VOICE=cedar
OPENAI_TTS_SPEED=1.0
```

**English.** `.env` is already ignored by Git. Keep the key there or in your shell environment, never in frontend code or a commit.

**简体中文.** `.env` 已经被 Git 忽略。请把密钥保存在该文件或本机终端环境中，不要写入前端代码，也不要提交到仓库。

**日本語.** `.env` は Git の対象外です。キーはこのファイルまたはローカルのシェル環境に保存し、フロントエンドやコミットには含めないでください。

## Generate or replace audio / 生成或替换音频 / 音声を生成・差し替える

**English.** Run the generator from the repository root. It reads every question and answer from `content/questions.json`, writes MP3 files under `public/audio/`, and updates the manifest. Unchanged clips are reused.

**简体中文.** 在仓库根目录运行生成器。脚本会读取 `content/questions.json` 中的每个问题与回答，在 `public/audio/` 下生成 MP3，并更新音频清单。内容未变化的音频会被复用。

**日本語.** リポジトリのルートで生成ツールを実行します。`content/questions.json` の質問と回答を読み、`public/audio/` に MP3 を作成してマニフェストを更新します。変更のない音声は再利用されます。

```bash
npm run audio:generate
```

```bash
# Regenerate one question and its answer
python3 scripts/generate_audio.py --id ja-01 --force

# Preview the work without calling the API
python3 scripts/generate_audio.py --dry-run
```

**English.** Audio names follow the question IDs. For example, `ja-01` uses `public/audio/ja/ja-01.mp3` for the question and `public/audio/ja/ja-01-a.mp3` for the sample answer.

**简体中文.** 音频文件名跟随问题 ID。例如，`ja-01` 的问题音频是 `public/audio/ja/ja-01.mp3`，参考回答音频是 `public/audio/ja/ja-01-a.mp3`。

**日本語.** 音声ファイル名は質問 ID に対応します。たとえば `ja-01` の質問音声は `public/audio/ja/ja-01.mp3`、回答例は `public/audio/ja/ja-01-a.mp3` です。

## Deploy with GitHub Pages / 使用 GitHub Pages 部署 / GitHub Pages で公開する

**English.** Fork this repository or push it to your own GitHub repository. In **Settings → Pages**, select **GitHub Actions** as the source. A push to `main` runs the included workflow and publishes the static build.

**简体中文.** Fork 本仓库，或把项目推送到你自己的 GitHub 仓库。进入 **Settings → Pages**，将来源设为 **GitHub Actions**。之后推送到 `main`，内置工作流就会构建并发布静态网站。

**日本語.** このリポジトリを Fork するか、自分の GitHub リポジトリへプッシュしてください。**Settings → Pages** で公開元を **GitHub Actions** に設定すると、`main` へのプッシュで同梱ワークフローが静的サイトをビルドして公開します。

```bash
npm run build:pages
npm run verify:pages
```

**English.** The Pages build publishes the MP3 files already stored in `public/audio/`, so the workflow does not need an OpenAI API key.

**简体中文.** Pages 构建会直接发布 `public/audio/` 中已有的 MP3，因此工作流不需要 OpenAI API Key。

**日本語.** Pages ビルドは `public/audio/` にある MP3 をそのまま公開するため、ワークフローに OpenAI API キーは必要ありません。

## Deploy with ChatGPT Sites / 使用 ChatGPT Sites 部署 / ChatGPT Sites で公開する

**English.** The `app/` entry is ready for ChatGPT Sites. Open the project in a Codex or ChatGPT environment with Sites available, then ask it to build and publish the existing project. The local `.openai/hosting.json` identifies that Sites project and is not committed.

**简体中文.** `app/` 入口已经适配 ChatGPT Sites。在支持 Sites 的 Codex 或 ChatGPT 环境中打开本项目，然后要求其构建并发布现有项目即可。本地 `.openai/hosting.json` 用于识别对应的 Sites 项目，不会提交到仓库。

**日本語.** `app/` のエントリは ChatGPT Sites に対応しています。Sites を利用できる Codex または ChatGPT でプロジェクトを開き、既存プロジェクトのビルドと公開を依頼してください。ローカルの `.openai/hosting.json` が Sites プロジェクトを識別し、Git にはコミットされません。

```bash
SITE_URL="https://your-site.example" npm run build
```

## Verify before publishing / 发布前检查 / 公開前の確認

**English.** Run the full check before publishing a change. It validates the content, generated browser data, README structure, dependencies, code, and GitHub Pages output. Use the audio-aware validator when questions or recordings change.

**简体中文.** 每次发布修改前请运行完整检查。它会校验题库、浏览器数据、README 结构、依赖、代码和 GitHub Pages 构建结果。问题或音频有变化时，再运行带音频检查的校验命令。

**日本語.** 変更を公開する前にテスト一式を実行してください。質問データ、ブラウザー用データ、README の構成、依存関係、コード、GitHub Pages の出力を確認します。質問や音声を変更した場合は、音声を含む検証も実行します。

```bash
npm test
node scripts/validate_content.mjs --require-audio
npm run build
```

## References and licences / 参考资料与许可证 / 参考資料とライセンス

- **English.** [OpenAI API quickstart](https://developers.openai.com/api/docs/quickstart) explains how to configure `OPENAI_API_KEY`.<br>**简体中文.** [OpenAI API 快速入门](https://developers.openai.com/api/docs/quickstart) 介绍如何配置 `OPENAI_API_KEY`。<br>**日本語.** [OpenAI API クイックスタート](https://developers.openai.com/api/docs/quickstart) では、`OPENAI_API_KEY` の設定方法を確認できます。
- **English.** [OpenAI text-to-speech guide](https://developers.openai.com/api/docs/guides/text-to-speech) covers speech-generation options.<br>**简体中文.** [OpenAI 文本转语音指南](https://developers.openai.com/api/docs/guides/text-to-speech) 介绍语音生成选项。<br>**日本語.** [OpenAI テキスト読み上げガイド](https://developers.openai.com/api/docs/guides/text-to-speech) では、音声生成の設定を確認できます。
- **English.** [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) describes the Actions-based deployment used here.<br>**简体中文.** [GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) 说明本项目采用的 Actions 部署方式。<br>**日本語.** [GitHub Pages のカスタムワークフロー](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) では、本プロジェクトで使う Actions ベースの公開方法を確認できます。

**English.** Source code is released under the [MIT License](LICENSE). The included sample questions, answers, and generated audio use the terms described in [LICENSE-CONTENT](LICENSE-CONTENT). Contributions are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

**简体中文.** 源代码采用 [MIT License](LICENSE)。内置示例问题、回答和生成音频适用 [LICENSE-CONTENT](LICENSE-CONTENT) 中说明的条款。欢迎提交改进；创建 Pull Request 前请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

**日本語.** ソースコードは [MIT License](LICENSE) で公開されています。同梱の質問例、回答例、生成音声には [LICENSE-CONTENT](LICENSE-CONTENT) の条件が適用されます。コントリビューションを歓迎します。Pull Request の前に [CONTRIBUTING.md](CONTRIBUTING.md) を確認してください。
