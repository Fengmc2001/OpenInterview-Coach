# Contributing / 贡献指南 / コントリビューション

## Welcome / 欢迎参与 / ようこそ

**English.** Contributions that improve accessibility, privacy, multilingual usability, content quality, deployment reliability, and documentation are welcome. Keep the repository useful as a general-purpose interview practice template rather than tailoring the public default to one identifiable person.

**简体中文。** 欢迎改进无障碍、隐私、多语言易用性、内容质量、部署可靠性与文档。请让仓库保持为通用面试练习模板，而不是把公开默认内容定制为某个可识别个人。

**日本語。** アクセシビリティ、プライバシー、多言語の使いやすさ、コンテンツ品質、デプロイの信頼性、ドキュメントを改善するコントリビューションを歓迎します。公開既定内容を特定可能な一人向けにせず、汎用的な面接練習テンプレートとして保ってください。

## Development setup / 开发环境 / 開発環境

**English.** Use Node.js 22.13 or later and install the locked dependencies. Create a topic branch from the current `main` branch.

**简体中文。** 请使用 Node.js 22.13 或更高版本并安装锁定依赖，然后从最新 `main` 创建主题分支。

**日本語。** Node.js 22.13 以降を使用し、ロックされた依存関係をインストールして、最新の `main` からトピックブランチを作成してください。

```bash
npm install
git switch -c feature/short-description
npm run dev
```

## Content contributions / 内容贡献 / コンテンツへの貢献

- **English:** Use fictional, synthetic, or fully generic prompts and answers; never submit an applicant's real private material without an explicit public-release decision.<br>**简体中文：**请使用虚构、合成或完全通用的问题与答案；未经明确公开决定，绝不要提交申请人的真实私人材料。<br>**日本語：**架空、合成、または完全に汎用的な質問と回答を使用し、明示的な公開判断なしに応募者の実際の非公開資料を提出しないでください。
- **English:** Keep question IDs globally unique, lowercase, path-safe, descriptive, and stable after release.<br>**简体中文：**问题 ID 必须全局唯一、使用小写、适合作为路径、具有描述性，并在发布后保持稳定。<br>**日本語：**質問 ID は全体で一意、小文字、パスに安全、説明的な形式にし、公開後は変更しないでください。
- **English:** Use a valid BCP 47 locale and proofread every language with a qualified speaker; machine translation alone is not acceptance evidence.<br>**简体中文：**请使用有效的 BCP 47 语言区域标记，并由具备相应语言能力的人校对；仅有机器翻译不能作为验收依据。<br>**日本語：**有効な BCP 47 ロケールを使用し、各言語を適切な話者が校正してください。機械翻訳だけでは受け入れ確認になりません。
- **English:** Example answers should demonstrate structure and reasoning without claiming credentials, achievements, affiliations, or experiences that a user may not possess.<br>**简体中文：**示例回答应展示结构与思路，不应声称用户可能并不具备的资历、成果、所属关系或经历。<br>**日本語：**回答例は構成と考え方を示し、ユーザーが持っていない可能性のある資格、実績、所属、経験を断定しないでください。

## Audio contributions / 音频贡献 / 音声への貢献

**English.** Generate audio only from content already approved for public release. Listen to every new file, verify the language and pronunciation, remove embedded metadata that contains private local information, and ensure the manifest hash matches the committed file.

**简体中文。** 只能为已经批准公开的内容生成音频。请逐个试听新文件，确认语言与发音，移除包含本机隐私信息的嵌入元数据，并确保清单哈希与提交文件一致。

**日本語。** 公開承認済みのコンテンツからだけ音声を生成してください。新しいファイルをすべて聞き、言語と発音を確認し、ローカルの個人情報を含む埋め込みメタデータを削除し、マニフェストのハッシュがコミット済みファイルと一致することを確認してください。

**English.** Do not commit an API key, generated request log, raw private recording, voice clone, or audio presented as a real person's speech. AI-generated voices must remain clearly disclosed in the interface and documentation.

**简体中文。** 不得提交 API Key、生成请求日志、原始私人录音、语音克隆，或被描述为真人语音的合成音频。界面与文档必须清楚披露 AI 生成语音。

**日本語。** API キー、生成リクエストログ、非公開の生録音、音声クローン、実在人物の発話として示される合成音声をコミットしないでください。AI 生成音声であることを画面とドキュメントで明確に表示し続けてください。

## Code contributions / 代码贡献 / コードへの貢献

**English.** Keep both deployment adapters working and avoid duplicating interview logic between them. User-facing controls should be keyboard reachable, labeled for assistive technology, usable at narrow widths, and resilient when audio is unavailable.

**简体中文。** 请确保两种部署适配层都可用，并避免在二者之间复制面试逻辑。面向用户的控件应支持键盘访问、具备辅助技术标签、适应窄屏，并能在音频不可用时正常降级。

**日本語。** 2 つのデプロイアダプターをどちらも動作させ、面接ロジックを重複させないでください。ユーザー向け操作はキーボードで到達でき、支援技術用ラベルがあり、狭い画面でも使え、音声がない場合も適切に動作する必要があります。

**English.** Do not introduce browser-side secret handling. A feature that requires authenticated OpenAI requests needs a separately reviewed server architecture, explicit user consent, a retention policy, rate limits, and abuse controls.

**简体中文。** 不要引入浏览器端密钥处理。任何需要经过身份验证的 OpenAI 请求的功能，都必须采用单独审查的服务端架构，并具备明确的用户同意、数据保留策略、速率限制及滥用防护。

**日本語。** ブラウザー側で秘密情報を扱う仕組みを追加しないでください。認証済み OpenAI リクエストが必要な機能は、別途レビューされたサーバー構成、明示的なユーザー同意、保存方針、レート制限、悪用対策を必要とします。

## Required checks / 必需检查 / 必須チェック

**English.** Run the complete suite before submitting. If your change affects visual or audio behavior, also test the development site manually in a current desktop browser and at a narrow mobile viewport.

**简体中文。** 提交前请运行完整测试。如果改动影响视觉或音频行为，还要在当前主流桌面浏览器与窄屏移动视口中手动测试开发站点。

**日本語。** 提出前にテスト一式を実行してください。見た目や音声動作に影響する変更では、現行デスクトップブラウザーと狭いモバイル幅でも開発サイトを手動確認してください。

```bash
npm test
```

**English.** The pull request should explain the user-visible outcome, privacy impact, content provenance, commands run, and any remaining limitation. Include screenshots only when they contain no personal data or credentials.

**简体中文。** Pull Request 应说明用户可见结果、隐私影响、内容来源、已运行命令及剩余限制。只有在截图不含个人信息或凭证时才可附上截图。

**日本語。** Pull Request には、ユーザーに見える結果、プライバシーへの影響、コンテンツの出所、実行したコマンド、残る制限を記載してください。個人情報や認証情報を含まない場合にだけスクリーンショットを添付してください。

## Review and licensing / 审查与授权 / レビューとライセンス

**English.** By submitting code, you agree that it may be distributed under the repository's MIT License. By submitting sample questions, answers, or audio, you confirm that you have the right to contribute them under the terms in `LICENSE-CONTENT` and that they contain no undisclosed personal data.

**简体中文。** 提交代码即表示你同意按本仓库的 MIT License 分发。提交示例问题、答案或音频即表示你确认有权按 `LICENSE-CONTENT` 的条款贡献这些内容，并且其中不含未披露的个人信息。

**日本語。** コードを提出すると、このリポジトリの MIT License で配布されることに同意したものとします。サンプル質問、回答、音声を提出する場合は、`LICENSE-CONTENT` の条件で提供する権利があり、未開示の個人情報を含まないことを確認してください。
