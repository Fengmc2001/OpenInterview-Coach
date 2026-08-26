# OpenInterview Coach / 开放面试教练 / オープン面接コーチ

**English.** OpenInterview Coach is a privacy-first, multilingual practice site for graduate-school, research, scholarship, and professional interviews. It ships with generic sample questions and static, high-quality audio, but its reusable architecture is not limited to Japanese or to academic interviews.

**简体中文。** OpenInterview Coach 是一个隐私优先、支持多语言的面试练习网站，适用于研究生、科研、奖学金及职业面试。项目内置通用示例问题与静态高质量音频，但这套可复用架构不限于日语，也不限于学术面试。

**日本語。** OpenInterview Coach は、大学院・研究・奨学金・就職面接に使える、プライバシー重視の多言語練習サイトです。汎用的なサンプル質問と静的な高品質音声を同梱していますが、再利用可能な構成は日本語や学術面接だけに限定されません。

> **English.** The browser application never asks for, stores, or sends an OpenAI API key. Optional audio generation runs only on your own computer, where `OPENAI_API_KEY` is read from a local environment variable.
>
> **简体中文。** 浏览器应用绝不会要求、保存或发送 OpenAI API Key。可选的音频生成仅在你自己的电脑上运行，并从本地环境变量读取 `OPENAI_API_KEY`。
>
> **日本語。** ブラウザーアプリが OpenAI API キーの入力を求めたり、保存・送信したりすることはありません。任意の音声生成は自分のコンピューター上だけで実行され、`OPENAI_API_KEY` はローカル環境変数から読み込まれます。

## Live demo / 在线演示 / ライブデモ

**English.** Try the GitHub Pages edition at [fengmc2001.github.io/OpenInterview-Coach](https://fengmc2001.github.io/OpenInterview-Coach/). It is a static build: questions and audio are downloaded as ordinary public assets, and no interview response is uploaded to a server.

**简体中文。** 可在 [fengmc2001.github.io/OpenInterview-Coach](https://fengmc2001.github.io/OpenInterview-Coach/) 体验 GitHub Pages 版本。这是纯静态构建：问题与音频以普通公开资源下载，任何面试回答都不会上传到服务器。

**日本語。** GitHub Pages 版は [fengmc2001.github.io/OpenInterview-Coach](https://fengmc2001.github.io/OpenInterview-Coach/) で試せます。これは静的ビルドであり、質問と音声は通常の公開アセットとして読み込まれ、面接回答がサーバーへ送信されることはありません。

## What you get / 项目包含内容 / 含まれるもの

- **English:** Twenty-seven generic sample questions—nine each in Japanese, English, and Simplified Chinese—with categories, progress controls, example answers, keyboard-friendly controls, and responsive layouts.<br>**简体中文：**共 27 道通用示例问题——日语、英语、简体中文各 9 道——并提供分类、进度控制、示例回答、键盘友好操作及响应式布局。<br>**日本語：**日本語・英語・簡体字中国語を各 9 問、合計 27 問の汎用サンプル質問と、カテゴリ、進捗操作、回答例、キーボード対応、レスポンシブレイアウト。
- **English:** Fifty-four pre-generated MP3 files—one question clip and one example-answer clip per card—with browser speech synthesis as a graceful fallback.<br>**简体中文：**共 54 个预生成 MP3——每张卡片各包含一个问题音频与一个示例回答音频——并在文件不可用时自动回退到浏览器语音合成。<br>**日本語：**各カードに質問音声と回答例音声を 1 つずつ、合計 54 個の生成済み MP3 と、音声ファイルが利用できない場合のブラウザー音声合成フォールバック。
- **English:** One content source, `content/questions.json`, that can be replaced without rewriting the interface.<br>**简体中文：**唯一内容源 `content/questions.json`，无需重写界面即可替换题库。<br>**日本語：**画面を書き換えずに差し替えられる、単一のコンテンツソース `content/questions.json`。
- **English:** Separate builds for GitHub Pages and ChatGPT Sites, plus validation, privacy scanning, and continuous integration.<br>**简体中文：**分别面向 GitHub Pages 与 ChatGPT Sites 的构建方式，以及内容校验、隐私扫描和持续集成。<br>**日本語：**GitHub Pages と ChatGPT Sites 向けの個別ビルド、コンテンツ検証、プライバシースキャン、継続的インテグレーション。
- **English:** A local OpenAI text-to-speech generator that writes deployable audio files without exposing credentials to the website.<br>**简体中文：**本地 OpenAI 文本转语音生成器，可产出可部署音频，同时不会把凭证暴露给网页。<br>**日本語：**認証情報をウェブサイトに公開せず、配布可能な音声を生成するローカル OpenAI テキスト読み上げツール。

## Privacy model / 隐私模型 / プライバシーモデル

**English.** This repository was created with a fresh public history and a synthetic, general-purpose question deck. It does not inherit private application history, personal interview answers, application records, school-specific plans, contact information, or human voice recordings.

**简体中文。** 本仓库采用全新的公开 Git 历史与人工编写的通用题库，不继承私人应用的历史记录、个人面试答案、申请材料、特定学校计划、联系方式或真人录音。

**日本語。** このリポジトリは、新しい公開 Git 履歴と汎用的に作成した質問デッキから始まっています。非公開アプリの履歴、個人的な面接回答、出願記録、特定大学向け計画、連絡先、本人の音声録音は引き継いでいません。

**English.** Treat every file committed to a public repository as permanently public. Before adding your own deck or audio, run the validation and privacy checks, inspect the staged diff, and keep personalized material in a private fork or an ignored local file.

**简体中文。** 请把公开仓库中的每个已提交文件都视为永久公开。添加自己的题库或音频前，请运行校验与隐私检查、检查暂存区差异，并把个性化材料保存在私有分支仓库或被忽略的本地文件中。

**日本語。** 公開リポジトリへコミットしたファイルは、すべて恒久的に公開されるものとして扱ってください。自分の質問や音声を追加する前に、検証とプライバシーチェックを実行し、ステージ済み差分を確認し、個人向け資料は非公開フォークまたは追跡対象外のローカルファイルに保存してください。

## Quick start / 快速开始 / クイックスタート

**English.** Requirements: Git, Node.js 22.13 or later, and npm. Python 3 is needed only when you generate new audio.

**简体中文。** 运行要求：Git、Node.js 22.13 或更高版本，以及 npm。只有生成新音频时才需要 Python 3。

**日本語。** 必要環境は Git、Node.js 22.13 以降、npm です。Python 3 は新しい音声を生成する場合にだけ必要です。

```bash
git clone https://github.com/Fengmc2001/OpenInterview-Coach.git
cd OpenInterview-Coach
npm install
npm run dev
```

**English.** Open the local URL printed by the development server. The included deck and MP3 files work without an API key.

**简体中文。** 打开开发服务器输出的本地网址。内置题库与 MP3 文件无需 API Key 即可使用。

**日本語。** 開発サーバーに表示されたローカル URL を開いてください。同梱の質問デッキと MP3 は API キーなしで利用できます。

## Customize the question deck / 自定义题库 / 質問デッキの変更

**English.** Edit `content/questions.json`. Keep every question ID unique and stable because audio paths and saved progress use those IDs. A deck may use any language supported by your content and playback environment.

**简体中文。** 编辑 `content/questions.json`。请确保每个问题 ID 唯一且保持稳定，因为音频路径和练习进度会使用这些 ID。题库可以使用内容与播放环境支持的任意语言。

**日本語。** `content/questions.json` を編集します。音声パスと練習進捗が ID を使用するため、各質問 ID は一意にし、後から変更しないでください。コンテンツと再生環境が対応していれば、どの言語でもデッキを作成できます。

```json
{
  "schemaVersion": 1,
  "project": {
    "name": "OpenInterview Coach",
    "contentNotice": "The sample material is fictional and generic.",
    "audioDisclosure": "The bundled MP3 files are AI-generated voices."
  },
  "decks": [
    {
      "id": "sample-en",
      "label": "EN",
      "locale": "en-US",
      "name": "English Interview Practice",
      "description": "A generic English-language interview deck.",
      "categories": {
        "all": "All",
        "motivation": "Motivation"
      },
      "questions": [
        {
          "id": "sample-en-01",
          "category": "Motivation",
          "question": "Why are you applying for this program?",
          "answer": "I would connect my preparation, the program's strengths, and my next learning goal."
        }
      ]
    }
  ]
}
```

**English.** Validate the schema and identifiers after every edit.

**简体中文。** 每次编辑后都要校验数据结构与标识符。

**日本語。** 編集後は毎回、スキーマと識別子を検証してください。

```bash
npm run validate
```

## Generate high-quality audio locally / 在本地生成高质量音频 / 高品質音声をローカル生成

**English.** Audio generation is optional. Create an API key in your own OpenAI account, keep it in an environment variable or an untracked `.env` file, and never paste it into the website, source code, Git history, issue tracker, or screenshots.

**简体中文。** 音频生成是可选功能。请在自己的 OpenAI 账户中创建 API Key，把它保存在环境变量或未被 Git 跟踪的 `.env` 文件中，绝不要粘贴到网页、源码、Git 历史、Issue 或截图里。

**日本語。** 音声生成は任意です。自分の OpenAI アカウントで API キーを作成し、環境変数または Git 管理外の `.env` に保存してください。ウェブ画面、ソースコード、Git 履歴、Issue、スクリーンショットには絶対に貼り付けないでください。

```bash
export OPENAI_API_KEY="your-key-here"
npm run audio:generate
```

**English.** The generator reads `content/questions.json` and writes static MP3 files plus a manifest under `public/audio/`. Review usage and pricing in your OpenAI account before generating a large deck. The included synthetic voices are AI-generated and must not be presented as recordings of a real person.

**简体中文。** 生成器读取 `content/questions.json`，并在 `public/audio/` 下写入静态 MP3 与清单文件。批量生成前，请先在 OpenAI 账户中确认用量与价格。内置合成语音由 AI 生成，不得冒充任何真人录音。

**日本語。** 生成ツールは `content/questions.json` を読み、静的 MP3 とマニフェストを `public/audio/` に出力します。大量生成の前に、OpenAI アカウントで利用量と料金を確認してください。同梱の合成音声は AI 生成であり、実在人物の録音として表示してはいけません。

## Build and verify / 构建与验证 / ビルドと検証

**English.** Run the full local acceptance suite before publishing. It checks content, privacy rules, code quality, the application build, and the relative paths used by the static Pages edition.

**简体中文。** 发布前请运行完整的本地验收流程。该流程会检查内容、隐私规则、代码质量、应用构建，以及静态 Pages 版本使用的相对路径。

**日本語。** 公開前にローカルの受け入れテスト一式を実行してください。コンテンツ、プライバシールール、コード品質、アプリのビルド、静的 Pages 版の相対パスを確認します。

```bash
npm test
```

**English.** Individual commands are available when you are iterating on one layer.

**简体中文。** 只修改某一层时，也可以分别运行相应命令。

**日本語。** 特定の層だけを変更している場合は、個別コマンドも利用できます。

```bash
npm run validate
npm run privacy:scan
npm run audit:prod
npm run lint
npm run build
npm run build:pages
npm run verify:pages
npm run docs:check
```

## Deploy to GitHub Pages / 部署到 GitHub Pages / GitHub Pages へデプロイ

**English.** The repository includes a GitHub Actions workflow that builds `pages-dist/` and publishes it with GitHub Pages. In a fork, enable Pages with “GitHub Actions” as the source, grant the workflow Pages permissions, and push to `main`. Do not add an API key secret because the static site does not need one.

**简体中文。** 仓库内置 GitHub Actions 工作流，会构建 `pages-dist/` 并发布到 GitHub Pages。在你的分支仓库中，请启用 Pages、把来源设为“GitHub Actions”、授予工作流 Pages 权限，然后推送到 `main`。静态网站不需要 API Key，因此不要添加 API Key Secret。

**日本語。** このリポジトリには、`pages-dist/` をビルドして GitHub Pages へ公開する GitHub Actions ワークフローが含まれています。フォーク側で Pages のソースを「GitHub Actions」に設定し、ワークフローへ Pages 権限を付与して、`main` にプッシュしてください。静的サイトに API キーは不要なので、API キーの Secret を追加しないでください。

```bash
npm run build:pages
npm run verify:pages
```

**English.** A project Pages site is served under a repository subpath, so the static build deliberately avoids root-only asset URLs. The verification script catches common broken-path regressions before deployment.

**简体中文。** 项目型 Pages 网站运行在仓库子路径下，因此静态构建会避免只能从域名根目录解析的资源地址。验证脚本可在部署前发现常见的路径失效问题。

**日本語。** プロジェクト型 Pages サイトはリポジトリのサブパスで配信されるため、静的ビルドはドメイン直下に依存するアセット URL を避けています。検証スクリプトにより、よくあるパス切れをデプロイ前に検出できます。

## Deploy with ChatGPT Sites / 通过 ChatGPT Sites 部署 / ChatGPT Sites でデプロイ

**English.** The Vinext application can also be built and hosted with ChatGPT Sites. Open this folder in a Sites-enabled Codex or ChatGPT workflow, ask it to publish the existing project, and follow the official Sites flow to create or reuse the project-specific hosting configuration. The committed `.openai/hosting.example.json` is only a non-secret shape reference; a real `.openai/hosting.json` stays local and must never reuse an identifier copied from another private site.

**简体中文。** Vinext 应用也可以通过 ChatGPT Sites 构建与托管。请在支持 Sites 的 Codex 或 ChatGPT 工作流中打开本文件夹，要求其发布现有项目，并按照官方 Sites 流程创建或复用本项目专属的托管配置。仓库中的 `.openai/hosting.example.json` 只是无敏感信息的结构示例；真实 `.openai/hosting.json` 保留在本地，绝不能复用从其他私人站点复制来的标识符。

**日本語。** Vinext アプリは ChatGPT Sites でもビルド・ホスティングできます。Sites 対応の Codex または ChatGPT ワークフローでこのフォルダーを開き、既存プロジェクトの公開を依頼し、公式の Sites 手順に従って、このプロジェクト専用のホスティング設定を作成または再利用してください。コミットされる `.openai/hosting.example.json` は秘密を含まない形式例にすぎません。実際の `.openai/hosting.json` はローカルに保持し、別の非公開サイトからコピーした識別子を再利用してはいけません。

```bash
npm install
npm run build
```

**English.** Set `SITE_URL` in the production runtime environment so favicon and social-preview metadata resolve against your deployed domain. This URL is public metadata, not a secret. For a self-hosted production check, pass the same variable when starting the server.

**简体中文。** 请在生产运行环境中设置 `SITE_URL`，使网站图标与社交预览元数据指向你的部署域名。这个网址属于公开元数据，不是密钥。自行托管并检查生产版本时，请在启动服务器时传入同一变量。

**日本語。** 本番実行環境では `SITE_URL` を設定し、ファビコンとソーシャルプレビューのメタデータがデプロイ先ドメインを参照するようにしてください。この URL は公開メタデータであり、秘密情報ではありません。セルフホストした本番版を確認する場合は、サーバー起動時にも同じ変数を渡します。

```bash
SITE_URL="https://your-site.example" npm start
```

**English.** ChatGPT Sites and GitHub Pages host the same public content but use different build adapters. A deployment target does not change the privacy boundary: secrets remain local, and only reviewed static content and audio are published.

**简体中文。** ChatGPT Sites 与 GitHub Pages 托管相同的公开内容，但使用不同的构建适配层。部署目标不会改变隐私边界：密钥始终留在本地，只有经过审查的静态内容与音频会被发布。

**日本語。** ChatGPT Sites と GitHub Pages は同じ公開コンテンツを配信しますが、異なるビルドアダプターを使用します。デプロイ先が変わってもプライバシー境界は変わりません。秘密情報はローカルに残り、レビュー済みの静的コンテンツと音声だけが公開されます。

## Project structure / 项目结构 / プロジェクト構成

```text
app/                         Vinext / ChatGPT Sites application
content/questions.json       Single public question source
github-pages/                Static GitHub Pages entry point
public/audio/                Generated MP3 files and manifest
scripts/                     Validation, privacy, audio, and build checks
.github/workflows/           Continuous integration and Pages deployment
.openai/hosting.example.json Non-secret Sites configuration example
ARCHITECTURE.md              Runtime and build boundaries
SECURITY.md                  Threat model and reporting guidance
CONTRIBUTING.md              Contribution workflow
```

**English.** Generated Pages files belong in `pages-dist/` and should not be edited by hand. The question JSON is the content source of truth; audio is a reviewed derivative keyed by stable question IDs.

**简体中文。** 生成的 Pages 文件位于 `pages-dist/`，不应手动编辑。题库 JSON 是内容的唯一事实来源；音频是按稳定问题 ID 关联、经过审查的派生产物。

**日本語。** 生成された Pages ファイルは `pages-dist/` に置かれ、手作業で編集しません。質問 JSON がコンテンツの唯一の正本であり、音声は安定した質問 ID に対応する、レビュー済みの派生成果物です。

## Security and responsible use / 安全与负责任使用 / セキュリティと責任ある利用

**English.** This tool is for rehearsal, not for covert assistance during a real interview. Example answers are scaffolding, not factual claims about you. Replace them with truthful material, respect interview rules, disclose AI-generated speech where required, and review [SECURITY.md](SECURITY.md) before publishing personal content.

**简体中文。** 本工具用于练习，不应用于真实面试中的隐蔽辅助。示例回答只是表达框架，并不代表关于你的事实。请替换为真实内容、遵守面试规则、在需要时披露 AI 生成语音，并在发布个人内容前阅读 [SECURITY.md](SECURITY.md)。

**日本語。** このツールは練習用であり、本番面接での隠れた支援を目的としません。回答例は構成の足場であり、あなた自身の事実を示すものではありません。真実に基づく内容へ置き換え、面接規則を守り、必要に応じて AI 生成音声を明示し、個人情報を公開する前に [SECURITY.md](SECURITY.md) を確認してください。

## Official references / 官方参考资料 / 公式参考資料

- **English:** [OpenAI API authentication](https://developers.openai.com/api/reference/overview#authentication) explains why API keys are secrets and must not appear in client-side code.<br>**简体中文：**[OpenAI API 身份验证](https://developers.openai.com/api/reference/overview#authentication) 说明 API Key 属于秘密信息，不得出现在客户端代码中。<br>**日本語：**[OpenAI API の認証](https://developers.openai.com/api/reference/overview#authentication) では、API キーが秘密情報であり、クライアント側コードに含めてはいけない理由が説明されています。
- **English:** [OpenAI Developer Quickstart](https://developers.openai.com/api/docs/quickstart) demonstrates configuring `OPENAI_API_KEY` as an environment variable.<br>**简体中文：**[OpenAI 开发者快速入门](https://developers.openai.com/api/docs/quickstart) 演示了如何把 `OPENAI_API_KEY` 配置为环境变量。<br>**日本語：**[OpenAI Developer Quickstart](https://developers.openai.com/api/docs/quickstart) では、`OPENAI_API_KEY` を環境変数として設定する方法が示されています。
- **English:** [OpenAI text-to-speech guide](https://developers.openai.com/api/docs/guides/text-to-speech) documents speech generation and the requirement to disclose that a voice is AI-generated.<br>**简体中文：**[OpenAI 文本转语音指南](https://developers.openai.com/api/docs/guides/text-to-speech) 说明语音生成方法，以及应披露语音由 AI 生成的要求。<br>**日本語：**[OpenAI テキスト読み上げガイド](https://developers.openai.com/api/docs/guides/text-to-speech) には音声生成方法と、AI 生成音声であることを明示する要件が記載されています。
- **English:** [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) documents the official Actions-based publication path.<br>**简体中文：**[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) 说明了官方的 Actions 发布流程。<br>**日本語：**[GitHub Pages のカスタムワークフロー](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) には、公式の Actions ベース公開手順が記載されています。
- **English:** [GitHub secret-scanning alerts](https://docs.github.com/en/code-security/concepts/secret-security/about-alerts) explains how GitHub detects exposed credentials and what alerts mean.<br>**简体中文：**[GitHub Secret Scanning 警报](https://docs.github.com/en/code-security/concepts/secret-security/about-alerts) 说明 GitHub 如何检测已暴露凭证及各类警报的含义。<br>**日本語：**[GitHub のシークレットスキャンアラート](https://docs.github.com/en/code-security/concepts/secret-security/about-alerts) では、公開された認証情報の検出方法とアラートの意味が説明されています。
- **English:** [ChatGPT Sites documentation](https://learn.chatgpt.com/docs/sites) is the official starting point for Sites projects and publishing.<br>**简体中文：**[ChatGPT Sites 文档](https://learn.chatgpt.com/docs/sites) 是创建与发布 Sites 项目的官方入口。<br>**日本語：**[ChatGPT Sites ドキュメント](https://learn.chatgpt.com/docs/sites) は、Sites プロジェクトの作成と公開に関する公式の出発点です。

## Contributing and licenses / 贡献与许可证 / コントリビューションとライセンス

**English.** Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md), keep examples fictional or generic, and run the complete test suite before opening a pull request.

**简体中文。** 欢迎贡献。请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，确保示例为虚构或通用内容，并在提交 Pull Request 前运行完整测试。

**日本語。** コントリビューションを歓迎します。[CONTRIBUTING.md](CONTRIBUTING.md) を読み、例文は架空または汎用的な内容にし、Pull Request を作成する前にテスト一式を実行してください。

**English.** Source code is available under the [MIT License](LICENSE). The sample question text and generated sample audio are available under the terms described in [LICENSE-CONTENT](LICENSE-CONTENT).

**简体中文。** 源代码采用 [MIT License](LICENSE)。示例问题文本与生成的示例音频适用 [LICENSE-CONTENT](LICENSE-CONTENT) 中说明的条款。

**日本語。** ソースコードは [MIT License](LICENSE) で提供されます。サンプル質問文と生成済みサンプル音声には、[LICENSE-CONTENT](LICENSE-CONTENT) に記載された条件が適用されます。
