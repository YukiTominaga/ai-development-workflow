# 家計簿アプリ REST API ドキュメント

このドキュメントは、家計簿アプリケーションのREST APIの使用方法を説明します。

## セットアップ

### 前提条件

- Node.js 20以上
- PostgreSQLデータベース

### インストール

```bash
# 依存関係をインストール
npm install

# Prisma Clientを生成
npx prisma generate

# データベースマイグレーション
npx prisma migrate dev

# 開発サーバーを起動
npm run dev
```

### 環境変数

`.env`ファイルを作成し、以下の変数を設定してください：

```
DATABASE_URL="postgresql://user:password@localhost:5432/household_budget"
```

## API エンドポイント

ベースURL: `http://localhost:3000/api`

---

## カテゴリ (Categories)

### カテゴリ一覧取得

```
GET /api/categories
```

**クエリパラメータ:**
- `type` (optional): `INCOME` または `EXPENSE` でフィルタリング

**レスポンス例:**
```json
[
  {
    "id": "clx1234567890",
    "name": "給与",
    "type": "INCOME",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "_count": {
      "transactions": 5
    }
  }
]
```

### カテゴリ作成

```
POST /api/categories
```

**リクエストボディ:**
```json
{
  "name": "食費",
  "type": "EXPENSE"
}
```

**レスポンス:** 作成されたカテゴリオブジェクト (ステータス: 201)

### カテゴリ取得

```
GET /api/categories/[id]
```

**レスポンス:** カテゴリオブジェクト

### カテゴリ更新

```
PUT /api/categories/[id]
```

**リクエストボディ:**
```json
{
  "name": "食費・日用品"
}
```

**レスポンス:** 更新されたカテゴリオブジェクト

### カテゴリ削除

```
DELETE /api/categories/[id]
```

**注意:** 取引が関連付けられているカテゴリは削除できません。

**レスポンス:**
```json
{
  "success": true
}
```

---

## 取引 (Transactions)

### 取引一覧取得

```
GET /api/transactions
```

**クエリパラメータ:**
- `type` (optional): `INCOME` または `EXPENSE`
- `categoryId` (optional): カテゴリIDでフィルタリング
- `startDate` (optional): 開始日 (ISO 8601形式)
- `endDate` (optional): 終了日 (ISO 8601形式)
- `limit` (optional): 取得件数
- `offset` (optional): オフセット

**レスポンス例:**
```json
{
  "data": [
    {
      "id": "clx9876543210",
      "type": "EXPENSE",
      "amount": 3500,
      "date": "2024-01-15T00:00:00.000Z",
      "description": "スーパーでの買い物",
      "categoryId": "clx1234567890",
      "category": {
        "id": "clx1234567890",
        "name": "食費",
        "type": "EXPENSE"
      },
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0
  }
}
```

### 取引作成

```
POST /api/transactions
```

**リクエストボディ:**
```json
{
  "type": "EXPENSE",
  "amount": 3500,
  "date": "2024-01-15T00:00:00.000Z",
  "description": "スーパーでの買い物",
  "categoryId": "clx1234567890"
}
```

**レスポンス:** 作成された取引オブジェクト (ステータス: 201)

### 取引取得

```
GET /api/transactions/[id]
```

**レスポンス:** 取引オブジェクト（カテゴリ情報を含む）

### 取引更新

```
PUT /api/transactions/[id]
```

**リクエストボディ:**
```json
{
  "amount": 4000,
  "description": "スーパーとドラッグストア"
}
```

**レスポンス:** 更新された取引オブジェクト

### 取引削除

```
DELETE /api/transactions/[id]
```

**レスポンス:**
```json
{
  "success": true
}
```

---

## 統計 (Statistics)

### 統計情報取得

```
GET /api/statistics
```

**クエリパラメータ:**
- `startDate` (optional): 開始日 (ISO 8601形式)
- `endDate` (optional): 終了日 (ISO 8601形式)
- `groupBy` (optional): `category`, `month`, または `day`

**レスポンス例:**
```json
{
  "summary": {
    "totalIncome": 500000,
    "totalExpense": 350000,
    "balance": 150000,
    "incomeCount": 2,
    "expenseCount": 45
  },
  "categoryBreakdown": [
    {
      "categoryId": "clx1234567890",
      "categoryName": "食費",
      "type": "EXPENSE",
      "totalAmount": 85000,
      "count": 15
    },
    {
      "categoryId": "clx0987654321",
      "categoryName": "給与",
      "type": "INCOME",
      "totalAmount": 500000,
      "count": 2
    }
  ],
  "timeSeriesData": [
    {
      "period": "2024-01",
      "income": 250000,
      "expense": 180000,
      "balance": 70000
    },
    {
      "period": "2024-02",
      "income": 250000,
      "expense": 170000,
      "balance": 80000
    }
  ]
}
```

---

## エラーレスポンス

すべてのエラーは以下の形式で返されます：

```json
{
  "error": "エラーメッセージ",
  "details": {
    // 追加のエラー詳細（オプション）
  }
}
```

### ステータスコード

- `200 OK`: リクエスト成功
- `201 Created`: リソース作成成功
- `400 Bad Request`: バリデーションエラー
- `404 Not Found`: リソースが見つからない
- `405 Method Not Allowed`: 許可されていないHTTPメソッド
- `500 Internal Server Error`: サーバーエラー

---

## データ型

### TransactionType
- `INCOME`: 収入
- `EXPENSE`: 支出

### 日付形式
すべての日付はISO 8601形式で指定してください：
- `2024-01-15T00:00:00.000Z`
- または `2024-01-15T09:00:00+09:00` (タイムゾーン付き)

---

## 使用例

### cURL

```bash
# カテゴリ作成
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"食費","type":"EXPENSE"}'

# 取引作成
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type":"EXPENSE",
    "amount":3500,
    "date":"2024-01-15T00:00:00.000Z",
    "categoryId":"clx1234567890",
    "description":"スーパーでの買い物"
  }'

# 統計取得（月別）
curl "http://localhost:3000/api/statistics?groupBy=month&startDate=2024-01-01T00:00:00.000Z&endDate=2024-12-31T23:59:59.999Z"
```

### JavaScript (fetch)

```javascript
// カテゴリ作成
const response = await fetch('/api/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '食費',
    type: 'EXPENSE'
  })
});
const category = await response.json();

// 取引一覧取得（フィルタ付き）
const transactions = await fetch(
  '/api/transactions?type=EXPENSE&startDate=2024-01-01T00:00:00.000Z'
).then(r => r.json());
```

---

## 注意事項

1. **データベース接続**: PostgreSQLデータベースが起動していることを確認してください
2. **マイグレーション**: 初回起動前に `npx prisma migrate dev` を実行してください
3. **静的エクスポート**: API Routesを使用するため、`next.config.ts`から`output: 'export'`を削除する必要があります
4. **カテゴリ削除**: 取引が関連付けられているカテゴリは削除できません。先に関連する取引を削除してください

---

## 開発ツール

### Prisma Studio

データベースを視覚的に確認・編集できます：

```bash
npx prisma studio
```

ブラウザで `http://localhost:5555` にアクセスしてください。

### データベースリセット

```bash
npx prisma migrate reset
```

---

## ライセンス

このAPIは研修用デモアプリケーションです。
