# 系統架構

## 架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                      LINE Platform                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │  LINE Bot   │    │    LIFF     │    │  Push Message   │  │
│  │  (Webhook)  │    │   (WebView) │    │    (通知)       │  │
│  └──────┬──────┘    └──────┬──────┘    └────────┬────────┘  │
└─────────┼──────────────────┼───────────────────┼────────────┘
          │                  │                   │
          ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 14 (App Router)                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │ /api/webhook│    │   /liff/*   │    │    /admin/*     │  │
│  │  (事件處理) │    │  (客人端)   │    │   (後台管理)    │  │
│  └──────┬──────┘    └──────┬──────┘    └────────┬────────┘  │
└─────────┼──────────────────┼───────────────────┼────────────┘
          │                  │                   │
          └──────────────────┼───────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                        Supabase                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │ PostgreSQL  │    │    Auth     │    │    Storage      │  │
│  │  (Prisma)   │    │  (後台登入) │    │   (商品圖片)    │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 技術選型

| 層級 | 技術 | 用途 |
|------|------|------|
| Framework | Next.js 14 | App Router + API Routes |
| UI | React 18 + Tailwind CSS | 元件化開發 |
| LINE SDK | @line/bot-sdk 9.x | Webhook、推播 |
| LIFF | @line/liff 2.x | LINE 內嵌網頁 |
| ORM | Prisma 5.x | 資料庫操作 |
| Database | Supabase PostgreSQL | 雲端資料庫 |
| Auth | Supabase Auth | 後台管理員認證 |
| Storage | Supabase Storage | 商品圖片 CDN |
| Language | TypeScript | 型別安全 |

---

## 專案目錄結構

```
/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API 路由
│   │   │   ├── webhook/          # LINE Webhook
│   │   │   ├── products/         # 商品 CRUD
│   │   │   ├── orders/           # 訂單 CRUD
│   │   │   └── notify/           # 推播通知
│   │   ├── admin/                # 後台管理頁面
│   │   └── liff/                 # LIFF 客人端
│   ├── components/               # React 元件
│   │   ├── admin/                # 後台專用元件
│   │   └── liff/                 # LIFF 專用元件
│   └── lib/                      # 工具函式庫
│       ├── db/                   # Prisma 客戶端
│       ├── line/                 # LINE SDK 封裝
│       └── supabase/             # Supabase 客戶端
├── prisma/
│   └── schema.prisma             # 資料庫結構
├── app_docs/                     # 應用文檔
└── .env.example                  # 環境變數範本
```

---

## 相關檔案

| 檔案 | 說明 |
|------|------|
| `package.json` | 套件依賴 |
| `tsconfig.json` | TypeScript 設定 |
| `next.config.mjs` | Next.js 設定 |
| `tailwind.config.ts` | Tailwind 設定 |
| `postcss.config.mjs` | PostCSS 設定 |
