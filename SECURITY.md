# Security and privacy / 安全与隐私 / セキュリティとプライバシー

## Supported boundary / 支持范围 / 対応範囲

**English.** The maintained reference deployment is a static browser application. It serves question text, sample answers, styles, scripts, and pre-generated audio. It does not need a database, authentication token, OpenAI API key, or response-upload endpoint. Microphone permission is requested only when a user starts a practice recording.

**简体中文。** 本项目维护的参考部署是静态浏览器应用，提供问题、参考回答、样式、脚本与预生成音频。它不需要数据库、身份验证令牌、OpenAI API Key 或回答上传接口。只有用户主动开始练习录音时，浏览器才会请求麦克风权限。

**日本語。** 保守対象の参照デプロイは静的ブラウザーアプリです。質問、回答例、スタイル、スクリプト、生成済み音声を配信し、データベース、認証トークン、OpenAI API キー、回答アップロード用エンドポイントを必要としません。マイク権限を求めるのは、ユーザーが練習録音を開始したときだけです。

## Secrets / 密钥 / シークレット

**English.** Never add an API-key input to the frontend. `OPENAI_API_KEY` is accepted only by the local audio-generation process. Store it in an environment variable or an ignored `.env` file, rotate it immediately if it appears in a commit, log, issue, screenshot, or deployed bundle, and review account usage for unexpected activity.

**简体中文。** 绝不要在前端添加 API Key 输入框。`OPENAI_API_KEY` 只允许由本地音频生成流程读取。请把它放在环境变量或被忽略的 `.env` 文件中；如果它出现在提交、日志、Issue、截图或部署包里，请立即轮换，并检查账户用量是否异常。

**日本語。** フロントエンドに API キー入力欄を追加しないでください。`OPENAI_API_KEY` を読み取れるのはローカル音声生成処理だけです。環境変数または無視対象の `.env` に保存し、コミット、ログ、Issue、スクリーンショット、配布バンドルに現れた場合は直ちにローテーションして、アカウント利用状況を確認してください。

**English.** A GitHub Actions secret is not required for the standard Pages deployment. Pre-generate audio locally and publish the reviewed MP3 files. Do not move API calls into a public workflow merely to avoid local generation, because untrusted pull-request content and logs create additional risk.

**简体中文。** 标准 Pages 部署不需要 GitHub Actions Secret。请在本地预生成音频，并发布经过审查的 MP3 文件。不要为了省去本地生成而把 API 调用移入公开工作流，因为不受信任的 Pull Request 内容与日志会带来额外风险。

**日本語。** 標準の Pages デプロイに GitHub Actions Secret は不要です。音声はローカルで事前生成し、レビュー済み MP3 を公開してください。ローカル生成を避けるためだけに API 呼び出しを公開ワークフローへ移すと、信頼できない Pull Request の内容やログによる追加リスクが生じます。

## Personal data / 个人信息 / 個人情報

**English.** Interview material can reveal identity, education, employment, health, immigration status, research ideas, unpublished results, or future plans. Keep personal decks in a private repository or outside Git, and use fictional placeholders in public examples. Removing a file in a later commit does not remove it from earlier public history.

**简体中文。** 面试材料可能暴露身份、教育经历、工作经历、健康状况、在留身份、研究构想、未公开结果或未来计划。请把个人题库放在私人仓库或 Git 之外，并在公开示例中使用虚构占位内容。后续提交中删除文件，并不能把它从早期公开历史中移除。

**日本語。** 面接資料には、本人情報、学歴、職歴、健康状態、在留資格、研究アイデア、未公開結果、将来計画が含まれる可能性があります。個人用デッキは非公開リポジトリまたは Git 管理外に置き、公開例では架空のプレースホルダーを使ってください。後のコミットで削除しても、過去の公開履歴からは消えません。

**English.** Before publishing, run `npm run privacy:scan`, inspect `git diff --cached`, decode and listen to newly added audio, and check file metadata. Automated scanning reduces risk but cannot determine whether a truthful-sounding answer is personally identifying.

**简体中文。** 发布前，请运行 `npm run privacy:scan`、检查 `git diff --cached`、解码并试听新增音频，同时检查文件元数据。自动扫描可以降低风险，但无法判断一段看似真实的回答是否足以识别个人身份。

**日本語。** 公開前に `npm run privacy:scan` を実行し、`git diff --cached` を確認し、新しい音声をデコードして聞き、ファイルメタデータも確認してください。自動スキャンはリスクを下げますが、もっともらしい回答が個人を特定できるかどうかまでは判断できません。

## Supply chain and deployment / 供应链与部署 / サプライチェーンとデプロイ

**English.** Dependency updates should pass continuous integration and be reviewed for unexpected transitive changes. Keep workflow permissions minimal, pin the expected Node major version, preserve the lockfile, and do not execute scripts from unreviewed question content.

**简体中文。** 依赖更新必须通过持续集成，并检查是否引入异常的传递依赖变化。请保持工作流权限最小化、固定预期的 Node 主版本、保留锁文件，并且不要执行未经审查的题库内容中的脚本。

**日本語。** 依存関係の更新は継続的インテグレーションを通し、想定外の推移的変更を確認してください。ワークフロー権限を最小化し、想定する Node メジャーバージョンを固定し、ロックファイルを保持し、未レビューの質問コンテンツからスクリプトを実行しないでください。

**English.** The real `.openai/hosting.json` is project-local and ignored. A Sites project identifier is not an API secret, but publishing an identifier copied from a private project creates unnecessary coupling and may disclose infrastructure relationships. Create a separate configuration for each public clone.

**简体中文。** 真实 `.openai/hosting.json` 是项目本地文件并被 Git 忽略。Sites 项目标识符并非 API 密钥，但公开从私人项目复制的标识符会造成不必要的耦合，也可能暴露基础设施关系。每个公开副本都应创建独立配置。

**日本語。** 実際の `.openai/hosting.json` はプロジェクトローカルで、Git 管理外です。Sites のプロジェクト識別子は API シークレットではありませんが、非公開プロジェクトからコピーした識別子を公開すると不要な結合が生まれ、インフラ関係が明らかになる可能性があります。公開クローンごとに別の設定を作成してください。

## Reporting a vulnerability / 脆弱性报告 / 脆弱性の報告

**English.** Do not publish exploitable details, exposed credentials, or personal data in a public issue. Use GitHub's private vulnerability-reporting feature when it is enabled for this repository. If private reporting is unavailable, open a minimal issue asking the maintainer for a private contact channel without including the sensitive evidence.

**简体中文。** 不要在公开 Issue 中发布可利用细节、已暴露凭证或个人信息。若本仓库启用了 GitHub 私密漏洞报告，请使用该功能；若未启用，请只提交一个最简 Issue，请维护者提供私下联系方式，不要附上敏感证据。

**日本語。** 悪用可能な詳細、漏えいした認証情報、個人情報を公開 Issue に投稿しないでください。このリポジトリで GitHub の非公開脆弱性報告が有効なら、その機能を使用してください。利用できない場合は、機微な証拠を含めず、非公開の連絡手段を求める最小限の Issue を作成してください。

## Out of scope / 范围外事项 / 対象外

**English.** Third-party browser speech engines, user-modified forks, locally supplied question content, OpenAI account security, GitHub account security, and unofficial deployments are controlled by their respective operators. Reports are still welcome when the reference project can make a safer default or clearer warning.

**简体中文。** 第三方浏览器语音引擎、用户修改的分支、本地提供的题库内容、OpenAI 账户安全、GitHub 账户安全及非官方部署均由各自运营者控制。如果参考项目可以提供更安全的默认值或更清晰的警告，我们仍欢迎相关报告。

**日本語。** サードパーティのブラウザー音声エンジン、ユーザーが変更したフォーク、ローカルで用意した質問内容、OpenAI アカウントの安全性、GitHub アカウントの安全性、非公式デプロイは、それぞれの運用者が管理します。ただし、参照プロジェクトの既定値や警告を改善できる場合は報告を歓迎します。
