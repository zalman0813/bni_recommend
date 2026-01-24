# 環境設定與部署指南

## 環境變數

| 變數名稱 | 說明 | 來源 |
|---------|------|------|
| `LINE_CHANNEL_SECRET` | LINE Channel Secret | LINE Developers |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Channel Access Token | LINE Developers |
| `NEXT_PUBLIC_LIFF_ID` | LIFF App ID | LINE Developers |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 專案 URL | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable Key (`sb_publishable_...`) | Supabase Dashboard |
| `SUPABASE_SECRET_KEY` | Secret Key (`sb_secret_...`) | Supabase Dashboard |
| `DATABASE_URL` | PostgreSQL 連線字串 | Supabase Dashboard |
| `NEXT_PUBLIC_BASE_URL` | 應用程式 Base URL | 自行設定 |

> **Note**: 舊版 `anon`/`service_role` keys 仍可使用，程式碼有做相容處理。

---

## LINE 設定

> 自 2024/9/4 起，必須先建立 LINE Official Account，再啟用 Messaging API。

### 1. 建立 LINE Official Account

1. 前往 [LINE Official Account 建立頁面](https://www.linebiz.com/tw/entry/)
2. 註冊 Business ID
3. 建立官方帳號

### 2. 啟用 Messaging API

1. 在 [LINE Official Account Manager](https://manager.line.biz/) 進入帳號
2. 設定 → Messaging API → 啟用
3. 選擇 Provider（無法更改）
4. 在 [LINE Developers Console](https://developers.line.biz/) 取得 Channel Secret 和 Access Token

### 3. 設定 Webhook

1. 在 LINE Developers Console → Messaging API 頁籤
2. 設定 Webhook URL: `https://your-domain.com/api/webhook`
3. 開啟 Use webhook
4. 在 LINE Official Account Manager 關閉自動回應訊息

### 4. 建立 LINE Login Channel（LIFF 用）

> LIFF 無法加到 Messaging API Channel，須另建 LINE Login Channel。

1. 在同一個 Provider 下建立 **LINE Login** Channel
2. 在 Basic settings → **Linked OA** 連結你的 LINE Official Account
3. 在 LIFF 頁籤新增 LIFF App
4. Endpoint URL: `https://your-domain.com/liff`
5. Size: `Full`
6. 取得 LIFF ID

---

## Supabase 設定

### 1. 建立專案

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 建立新專案
3. 等待專案初始化完成

### 2. 取得 API Keys

1. 進入 Project Settings → API
2. 在 **Project API keys** 區塊複製：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - **Secret key** → `SUPABASE_SECRET_KEY`
3. 進入 Project Settings → Database
4. 複製 Connection string (URI) → `DATABASE_URL`

### 3. 建立 Storage Bucket

1. 進入 Storage
2. 建立新 Bucket: `products`
3. 設定為 Public

---

## 快速開始

```bash
# 1. Clone 專案
git clone <repo-url>
cd line-bot-template

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env
# 編輯 .env 填入所有必要設定

# 4. 初始化資料庫
npx prisma db push
npx prisma generate

# 5. 啟動開發伺服器
npm run dev

# 6. 使用 ngrok 測試 Webhook (開發時)
ngrok http 3000
# 將 ngrok URL 設定到 LINE Webhook
```

---

## 部署 (Vercel)

1. Push 到 GitHub
2. 在 Vercel 匯入專案
3. 設定環境變數
4. 部署完成後更新 LINE Webhook URL

---

## 相關檔案

| 檔案 | 說明 |
|------|------|
| `.env.example` | 環境變數範本 |
| `prisma/schema.prisma` | 資料庫結構 |
| `package.json` | 套件依賴 |
