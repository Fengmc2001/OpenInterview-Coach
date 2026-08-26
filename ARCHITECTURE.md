# Architecture / 架构 / アーキテクチャ

## Scope / 范围 / 対象範囲

**English.** OpenInterview Coach is a static-content interview rehearsal application with two presentation adapters. The Vinext adapter supports ChatGPT Sites, while a Vite static entry supports GitHub Pages. Both consume the same reviewed question data and public audio assets.

**简体中文。** OpenInterview Coach 是一个静态内容面试练习应用，包含两种展示适配层：Vinext 适配 ChatGPT Sites，Vite 静态入口适配 GitHub Pages。两者共用同一份经过审查的题库数据与公开音频资源。

**日本語。** OpenInterview Coach は、2 種類の表示アダプターを持つ静的コンテンツ型の面接練習アプリです。Vinext アダプターは ChatGPT Sites、Vite の静的エントリは GitHub Pages に対応し、どちらも同じレビュー済み質問データと公開音声アセットを利用します。

```text
                     content/questions.json
                               |
                 validate + privacy scan
                               |
                 shared React coach interface
                         /              \
                Vinext adapter       Vite static entry
                         |              |
                  ChatGPT Sites     GitHub Pages

local OPENAI_API_KEY -> audio generator -> public/audio/*.mp3
          (build-time only; never available to either browser runtime)
```

## Architectural principles / 架构原则 / 設計原則

- **English:** One reviewed content source feeds every deployment target.<br>**简体中文：**每个部署目标都读取同一份经过审查的内容源。<br>**日本語：**すべてのデプロイ先が、同じレビュー済みコンテンツソースを利用します。
- **English:** The deployed browser runtime is static and has no secret-bearing backend.<br>**简体中文：**部署后的浏览器运行时是静态的，不包含持有密钥的后端。<br>**日本語：**公開後のブラウザー実行環境は静的で、秘密情報を保持するバックエンドを持ちません。
- **English:** Stable question IDs connect content, audio files, and progress state.<br>**简体中文：**稳定的问题 ID 负责关联内容、音频文件和练习进度。<br>**日本語：**安定した質問 ID が、コンテンツ、音声ファイル、進捗状態を結び付けます。
- **English:** Generated artifacts are reproducible derivatives, never hand-edited sources.<br>**简体中文：**生成产物是可复现的派生文件，不是手工编辑的源文件。<br>**日本語：**生成物は再現可能な派生ファイルであり、手作業で編集するソースではありません。
- **English:** Public history begins from a privacy-reviewed baseline instead of a private repository fork.<br>**简体中文：**公开历史从经过隐私审查的基线开始，而不是从私人仓库 Fork 而来。<br>**日本語：**公開履歴は、非公開リポジトリのフォークではなく、プライバシーレビュー済みの基準点から開始します。

## Runtime boundaries / 运行时边界 / 実行時境界

**English.** The client loads the question JSON and audio manifest as public assets. It maintains only presentation state such as the current deck, current question, answer visibility, playback state, and local progress. The reference implementation does not transmit spoken responses or typed notes.

**简体中文。** 客户端把题库 JSON 与音频清单作为公开资源加载，只维护当前题库、当前问题、答案显示、播放状态和本地进度等展示状态。参考实现不会传输口述回答或输入笔记。

**日本語。** クライアントは質問 JSON と音声マニフェストを公開アセットとして読み込みます。保持するのは、現在のデッキ、質問、回答表示、再生状態、ローカル進捗などの表示状態だけです。参照実装は、発話回答や入力メモを送信しません。

**English.** Playback prefers a pre-generated MP3 associated with the question ID. If that asset is unavailable, the interface may use the browser's speech-synthesis API. Browser speech is a fallback and can differ by operating system, installed voices, and accessibility settings.

**简体中文。** 播放时优先使用与问题 ID 关联的预生成 MP3。如果该资源不可用，界面可以回退到浏览器语音合成 API。浏览器语音仅为备用方案，其效果会因操作系统、已安装语音与无障碍设置而不同。

**日本語。** 再生時は、質問 ID に対応する生成済み MP3 を優先します。アセットが利用できない場合、ブラウザーの音声合成 API にフォールバックできます。ブラウザー音声は補助機能であり、OS、インストール済み音声、アクセシビリティ設定によって結果が異なります。

## Content and audio pipeline / 内容与音频流程 / コンテンツと音声の流れ

**English.** `content/questions.json` is the source of truth. Validation checks required fields, locale metadata, global ID uniqueness, and the path-safe format of IDs. The privacy scanner blocks common secrets, contact data, absolute local paths, and project-specific terms supplied through an optional untracked private-terms file.

**简体中文。** `content/questions.json` 是唯一事实来源。校验程序检查必填字段、语言区域元数据、全局 ID 唯一性及 ID 的路径安全格式。隐私扫描会拦截常见密钥、联系方式、本机绝对路径，以及通过可选且不纳入 Git 的私有词表提供的项目特定词语。

**日本語。** `content/questions.json` が唯一の正本です。検証では必須フィールド、ロケール情報、ID の全体一意性、パスに安全な ID 形式を確認します。プライバシースキャンは、一般的な秘密情報、連絡先、ローカル絶対パス、および任意の Git 管理外プライベート用語ファイルで指定された固有語を検出します。

**English.** The audio generator runs outside the web application, reads the same content source, calls the OpenAI API with the user's local credential, and writes deterministic ID-based paths under `public/audio/`. The manifest records public metadata and content hashes, never the key or a local absolute path.

**简体中文。** 音频生成器在 Web 应用之外运行，读取同一内容源，使用用户本地凭证调用 OpenAI API，并按问题 ID 在 `public/audio/` 下写入确定的路径。清单只记录公开元数据与内容哈希，绝不记录 API Key 或本机绝对路径。

**日本語。** 音声生成ツールはウェブアプリの外で実行され、同じコンテンツソースを読み、ユーザーのローカル認証情報で OpenAI API を呼び出し、`public/audio/` 以下へ質問 ID ベースの決定的なパスで出力します。マニフェストに記録するのは公開メタデータとコンテンツハッシュだけで、API キーやローカル絶対パスは記録しません。

## Build adapters / 构建适配层 / ビルドアダプター

**English.** `npm run build` builds the Vinext application used by ChatGPT Sites. The local `.openai/hosting.json` belongs to one Sites project and is ignored by Git; `.openai/hosting.example.json` documents only the safe shape.

**简体中文。** `npm run build` 构建供 ChatGPT Sites 使用的 Vinext 应用。本地 `.openai/hosting.json` 只属于某一个 Sites 项目并被 Git 忽略；`.openai/hosting.example.json` 仅说明安全的结构格式。

**日本語。** `npm run build` は ChatGPT Sites 用の Vinext アプリをビルドします。ローカルの `.openai/hosting.json` は 1 つの Sites プロジェクトに属し、Git では無視されます。`.openai/hosting.example.json` は安全な形式だけを示します。

**English.** `npm run build:pages` builds the static entry into `pages-dist/`. Asset paths are base-aware so a project site works beneath `/OpenInterview-Coach/` instead of assuming the domain root. `npm run verify:pages` inspects the output before upload.

**简体中文。** `npm run build:pages` 把静态入口构建到 `pages-dist/`。资源路径会感知基础路径，因此项目站点可在 `/OpenInterview-Coach/` 子路径下运行，而不是假定部署在域名根目录。`npm run verify:pages` 会在上传前检查输出。

**日本語。** `npm run build:pages` は静的エントリを `pages-dist/` に出力します。アセットパスはベースパス対応のため、ドメイン直下を前提とせず `/OpenInterview-Coach/` 以下で動作します。`npm run verify:pages` がアップロード前に出力を検査します。

## Extension points / 扩展点 / 拡張ポイント

- **English:** Add a language by adding a deck with a BCP 47 locale and questions; no interface fork is required.<br>**简体中文：**通过添加带 BCP 47 语言区域与问题的题库即可新增语言，无需分叉界面代码。<br>**日本語：**BCP 47 ロケールと質問を持つデッキを追加すれば、画面コードを分岐せずに言語を増やせます。
- **English:** Add content fields only through a schema revision, validator update, UI handling, and migration note.<br>**简体中文：**新增内容字段时，必须同步修改数据结构版本、校验器、界面处理与迁移说明。<br>**日本語：**コンテンツフィールドを追加する場合は、スキーマ改訂、検証更新、UI 対応、移行メモを一緒に行います。
- **English:** A server-side coaching feature must be a separate opt-in architecture with authentication, retention, consent, and abuse controls; do not place an API key in this static client.<br>**简体中文：**服务端辅导功能必须采用独立且由用户主动选择的架构，并具备身份验证、数据保留、同意与滥用防护；不要把 API Key 放入本静态客户端。<br>**日本語：**サーバー側コーチ機能を追加する場合は、認証、保存方針、同意、悪用対策を備えた別のオプトイン設計にし、この静的クライアントへ API キーを置いてはいけません。
