# 実践

Claude Code Actionsを利用する準備が整ったところで、続いてはClaude CodeのようなAIコーディングエージェントがより効果的に優れたプログラミングコードを開発するための下準備や、LLMへのcontextとして効果的に作用する例を紹介します。

ここでは、Webページやモバイルアプリを作成する画面と機能に対するアプローチと、データベースへのクエリのためのコードを書くバックエンドに対するアプローチの2通りを紹介します。

今日は先週のTODOアプリよりも高機能なものに挑戦したいので、「家計簿アプリ」をお題にします。

※今日紹介するものはあくまでアプローチの一例と考えていただき、これをヒントに自分たちにとってより良い手法は何かを考えるきっかけになると幸いです。

## 1. 共通 CLAUDE.mdなどの整備

どんなアプリケーションを作るにしても、プロジェクトのメンバーで共有するプログラムコーディングの方針指示ファイルを最初に時間をかけて整備します。

Claude Codeであれば`CLAUDE.md`というファイルをプロジェクトルートから再帰的に読み込みます。

プロジェクトルートに置かれた`CLAUDE.md`は全てのClaude Codeセッションに適用され、`foo/bar/CLAUDE.md`に置かれたファイルは`foo/bar/`ディレクトリ以下のファイルを読み込む際にのみ適用されます。

今回は[この内容](https://github.com/YukiTominaga/ai-development-workflow/blob/main/CLAUDE.md)で用意しました。

以下の画像で示した`Copy raw file`をクリックしてクリップボードに内容をコピーしてください。

![Copy raw file](/docs/images/2.1.png)

続いて**自分のrepositoryの**`CLAUDE.md`を開き、クリップボードの内容をペーストし、Commit Changesをクリックしてください。

![Commit Changes](/docs/images/2.2.png)

Commit messageが自動で挿入されるので、そのままCommit Changesをクリックします。

![Create fork](/docs/images/2.3.png)

これで、今後Claude Codeがタスクを実行する際には常にCLAUDE.mdに記載されている内容を考慮します。

### コラム AGENT.md

現代では様々なコーディングエージェントが登場していますが、それぞれのエージェント用に設定ファイルを用意する瞬間がありました。

複数種類のコーディングエージェントで共通のルールファイルを整備するという思想で[AGENT.md](https://agents.md/)というフォーマットが策定されました。

Codex、Gemini、Cursorなどはこのフォーマットファイルに従うのですが、[Claude Codeは現時点では対応しておらず、対応予定も決まっていません。](https://github.com/anthropics/claude-code/issues/6235)


## 2. 画像contextで画面開発のアウトプット品質を向上させる

先週のTODOアプリではあまり自分が思い描く理想の画面が完成している人はなかなかいなかったと思います。

しかし、どのような画面が作成されれば良いのかを文章としての要件として伝えることは非常に困難です。

そんな時に提案したいのが、画像contextで作りたい画面をエージェントに提示することです。

GitHubアカウントで利用できる画像contextを作るためのサービスをいくつか紹介します。

### 2.1. v0

[v0](https://v0.app/)はこのrepositoryでも採用しているNext.jsというアプリケーションフレームワークの開発元であるVercel社が提供するサービスです。

v0で作成したアプリケーションをそのままVercelプラットフォームにデプロイすることができて、データベースや認証基盤の利用も可能です。


### 2.2. Bolt

[Bolt](https://bolt.new/)オンラインIDEで有名なStackBlitz社が提供しており、v0と同様にアプリケーションのプロトタイプを作成できます。

作成したプロトタイプをそのままオンラインIDEで編集できるのが結構良い、かも。

### 2.3. Figma make

[Figma make](https://www.figma.com/ja-jp/make/)はFigmaが提供するプロトタイプ作成ツールです。

デザインツールとしてのFigmaとの親和性が高く、会社で運用しているデザインシステムを読み込んで画面を作成できたり、カスタマイズがやりやすいUIが個人的に好みなので、これを使っています。

---

これらのうち、v0とBoltはGitHubアカウントがあれば最低限無料プランで試すことが可能です。

今日はFigma makeのデモを行いますが、みなさんもv0やBoltを使って使いやすい家計簿アプリを目指してみてください。

[sample](/docs/images/sample) ディレクトリにClaude Codeに与えるcontextの画像を用意しておきます。

### コラム 画像のcontextを作るための画像が欲しい

こういうことをよく思うので、個人的に[Hero UI Pro](https://www.heroui.pro/components)というcomponentsをいつも参考にしています。

Figma makeに画像を添付することができるので、このcomponentsの中から作りたいものに近いそれっぽいものを見つけてきて、Figma makeのcontextとして与えています。

これは実装のコードを見るために課金が必要なのですが、デザインを見るだけなら無料なので比較的利用しやすいと思います。

### 2.4. Claude Codeに家計簿アプリを作らせる

画像contextが用意できたところで、Claude Codeに家計簿アプリを作成してもらいましょう。

GitHubのIssueには、クリップボードにコピーした画像をそのままペースト可能です。

Windowsならば `Win + Shift + S`、Macならば `Cmd + Shift + Ctrl + 4` で任意の領域をクリップボードにコピーできます。

これで、自分で作った家計簿アプリの画像またはサンプルの画像をコピーして、新たに作成するIssueに貼りましょう。

要件を文章で指示することも大切なので、画像に加えて次の文章も加えておきます。

```
この画像で表現されている家計簿アプリを作ってほしい。

それぞれのタブは次のような機能を備えます

概要

- 資産の残高の表示
- 月ごとの収入と支出の表示
- 新しい取引を追加するためのUI

履歴

- 月ごとの取引履歴の表示
- どんなカテゴリでいくらの収入/支出があったのか
- 取引の年月日
- 取引の編集と削除ができる

内訳

- 月ごと、カテゴリごとに支出と収入の内訳が円グラフとテーブルで表示される
```

こんな感じのIssue編集画面になるので、@claudeをIssueのどこかにつけて作成します。

タスクの完了を待ってからPRを作成し、mainブランチにmergeしてみましょう。

※PR Agentの完了は待たなくて良いです。

![Create fork](/docs/images/2.4.png)

## 3. データベーススキーマを活用してバックエンド開発

ここからはバックエンド開発のための工夫に焦点を当てます。

HTTPリクエストによるREST APIを開発する、というタスクを仮定して、PostgreSQLの利用とAPIの開発を効率化します。

### 3.1 ORMを活用してスキーマを定義する

あくまで私個人の経験での話になりますが、基本的にRDBMSを採用する場合において、データベーススキーマを設計することは設計工程における最も重要なタスクのうちの1つです、という仮定で話を進めます。

データベーススキーマの定義方法を考えた時、会社やチームの文化により様々な方法がありますが、ここでおすすめしたいのはORM(Object Relation Mapper)の活用です。

ORMを採用することで、データベーススキーマをコードとして定義することが可能です。

私は2023年頃からORMの定義がAIエージェントにとってアプリケーションのデータモデリングを理解するための重要なcontextになると考え、この手法を長年(2年)採用してきました。

ORMを利用したことが無い方に向けて、TODOアプリのORMを [Prisma](https://www.prisma.io/) というOSSを例に示します。

TODOアプリのデータをRDBMSに保存しようと思ったらどういうテーブルが必要か、という考慮をしながらちょっと眺めてみてください。

```schema.prisma
enum TaskStatus {
  Pending
  Running
  Completed
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Task {
  id        String      @id @default(uuid())
  title     String
  status    TaskStatus  @default(Pending)
  subtasks  SubTask[]
  userId    String
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  @@index([userId])
  @@map("tasks")
}

model SubTask {
  id        String      @id @default(uuid())
  title     String
  status    TaskStatus  @default(Pending)
  taskId    String
  task      Task        @relation(fields: [taskId], references: [id], onDelete: Cascade)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  @@index([taskId])
  @@map("subtasks")
}
```

この定義では、`users`, `tasks`, `subtasks`という3つのテーブルを定義しています。

人間にとってそうであるのと同じように、このコードとしてのテーブル定義はAIエージェントにとって必要なデータベース操作コードを理解するのに大きく役立ちます。

今回は家計簿アプリに必要なprismaスキーマを[ここ](/prisma/schema.prisma)に用意したので、このスキーマをcontextにしてAPIを開発します。

※ ちなみにこのスキーマ自体も画像と要件を与えてAIで作っています。本番ではここにもっと人間の時間をかけた方が良いです。

このスキーマファイルのページに遷移して、その内容をクリップボードにコピーします。

![Create fork](/docs/images/2.5.png)

自分のrepositoryでissueを作成し、次の文章の下にコピーしたスキーマをペーストします。

```
@claude

以下の内容のスキーマを利用する家計簿アプリのためのREST APIを開発してください。

環境による制約は無視してください。
```

次の画像のようになります。

![Create fork](/docs/images/2.6.png)

あとはいつも通りにClaude Codeに実装してもらい、PRから実装内容を確認してみてください。
