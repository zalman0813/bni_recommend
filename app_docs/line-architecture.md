# LINE 整合架構圖

## 整體架構

> **重要**: LIFF 無法加到 Messaging API Channel，須另建 LINE Login Channel。

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LINE Platform                                   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         Provider (開發者帳號)                        │    │
│  │                                                                      │    │
│  │   管理多個 Channel，同一 Provider 下的 Channel 可共享用戶資料        │    │
│  │                                                                      │    │
│  │  ┌────────────────────────────┐  ┌────────────────────────────┐     │    │
│  │  │   Messaging API Channel    │  │    LINE Login Channel      │     │    │
│  │  │                            │  │       (LIFF 專用)          │     │    │
│  │  │  • Channel Secret          │  │                            │     │    │
│  │  │  • Channel Access Token    │  │  ┌──────────────────────┐  │     │    │
│  │  │                            │  │  │      LIFF App        │  │     │    │
│  │  │  ┌──────────────────────┐  │  │  │                      │  │     │    │
│  │  │  │    Webhook 設定      │  │  │  │  • LIFF ID           │  │     │    │
│  │  │  │                      │  │  │  │  • Endpoint URL      │  │     │    │
│  │  │  │  • Webhook URL       │  │  │  │  • Size (Full)       │  │     │    │
│  │  │  │  • 驗證狀態          │  │  │  │  • Scope (profile)   │  │     │    │
│  │  │  └──────────────────────┘  │  │  └──────────────────────┘  │     │    │
│  │  └─────────────┬──────────────┘  └──────────────┬─────────────┘     │    │
│  │                │                                │                    │    │
│  │                │         Linked OA              │                    │    │
│  │                │◄───────────────────────────────┘                    │    │
│  │                │      (連結到同一個官方帳號)                          │    │
│  └────────────────┼─────────────────────────────────────────────────────┘    │
│                   │                                                          │
│                   │ 連結                                                     │
│                   ▼                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    LINE Official Account (官方帳號)                  │    │
│  │                                                                      │    │
│  │  用戶實際加入好友的帳號，顯示名稱、頭像、狀態訊息等                 │    │
│  │                                                                      │    │
│  │  • 帳號名稱/頭像          用戶看到的 Bot 資訊                       │    │
│  │  • 自動回應設定           需關閉，改由 Webhook 處理                  │    │
│  │  • 好友數/訊息統計        在 Official Account Manager 查看           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Channel 關係說明

```
Provider (你的開發者帳號)
├── Messaging API Channel ──────┐
│   • Webhook 處理              │
│   • 推播訊息 API              ├──► 連結到同一個 LINE Official Account
│                               │
└── LINE Login Channel ─────────┘
    • LIFF App
    • 透過 Linked OA 連結
```

---

## 訊息流程

```
┌──────────────┐                    ┌──────────────────────────────────────┐
│              │                    │           LINE Platform              │
│   用戶手機   │                    │                                      │
│   LINE App   │                    │  ┌────────────────────────────────┐  │
│              │                    │  │     LINE Official Account      │  │
└──────┬───────┘                    │  │        (團購管家 Bot)          │  │
       │                            │  └───────────────┬────────────────┘  │
       │ ① 發送訊息                 │                  │                   │
       │   「我要下單」             │                  │                   │
       ▼                            │                  ▼                   │
┌──────────────┐                    │  ┌────────────────────────────────┐  │
│  LINE 伺服器 │ ──────────────────►│  │    Messaging API Channel       │  │
└──────────────┘                    │  │                                │  │
       │                            │  │  ② 轉發事件到 Webhook URL      │  │
       │                            │  └───────────────┬────────────────┘  │
       │                            └──────────────────┼───────────────────┘
       │                                               │
       │                                               │ POST /api/webhook
       │                                               │ (含簽名驗證)
       │                                               ▼
       │                            ┌──────────────────────────────────────┐
       │                            │          你的 Next.js 伺服器         │
       │                            │                                      │
       │                            │  ③ 驗證簽名 (Channel Secret)         │
       │                            │  ④ 解析事件內容                      │
       │                            │  ⑤ 處理業務邏輯                      │
       │                            │  ⑥ 準備回覆訊息 (Flex Message)       │
       │                            │                                      │
       │                            └───────────────┬──────────────────────┘
       │                                            │
       │                                            │ ⑦ Reply/Push API
       │                                            │   (Channel Access Token)
       │                                            ▼
       │                            ┌──────────────────────────────────────┐
       │                            │           LINE Platform              │
       │ ◄──────────────────────────│                                      │
       │  ⑧ 推送回覆訊息            │      將訊息送回給用戶                │
       │                            │                                      │
       ▼                            └──────────────────────────────────────┘
┌──────────────┐
│   用戶手機   │
│   收到回覆   │
│ 「點此下單」 │
└──────────────┘
```

---

## LIFF 流程

```
┌──────────────┐                    ┌──────────────────────────────────────┐
│              │                    │           LINE Platform              │
│   用戶手機   │                    │                                      │
│   LINE App   │                    │  ┌────────────────────────────────┐  │
│              │                    │  │    LINE Login Channel          │  │
└──────┬───────┘                    │  │    (LIFF 專用)                 │  │
       │                            │  │                                │  │
       │ ① 點擊 LIFF 連結          │  │  ┌──────────────────────────┐  │  │
       │    line://app/xxx          │  │  │       LIFF App           │  │  │
       │                            │  │  │  LIFF ID: xxx-abcdefgh   │  │  │
       │                            │  │  │  Endpoint: app.com/liff  │  │  │
       │                            │  │  └─────────────┬────────────┘  │  │
       │                            │  └────────────────┼───────────────┘  │
       ▼                            └───────────────────┼──────────────────┘
┌──────────────┐                                        │
│  LINE 內建   │                                        │
│  WebView     │ ◄──────────────────────────────────────┘
│  瀏覽器      │         ② 載入 Endpoint URL
└──────┬───────┘
       │
       │ ③ LIFF SDK 初始化
       │    liff.init({ liffId })
       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          你的 Next.js 伺服器                              │
│                                                                          │
│  /liff 頁面 (在 LINE WebView 中運行)                                     │
│                                                                          │
│  ④ liff.getProfile()     取得用戶 LINE 資料 (userId, displayName, etc)  │
│  ⑤ 顯示商品列表           呼叫 /api/products                            │
│  ⑥ 加入購物車             localStorage 儲存                             │
│  ⑦ 確認下單               POST /api/orders                              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
       │
       │ ⑧ 下單成功後
       │    透過 Messaging API 推送確認訊息
       ▼
┌──────────────┐
│   用戶手機   │
│   收到訂單   │
│   確認通知   │
└──────────────┘
```

---

## 各實體說明

### LINE Platform 端

| 實體 | 說明 | 管理位置 |
|------|------|---------|
| **Provider** | 開發者帳號，管理多個 Channel | LINE Developers Console |
| **Messaging API Channel** | Webhook、推播 API 入口 | LINE Developers Console |
| **LINE Login Channel** | LIFF App 專用 Channel | LINE Developers Console |
| **LINE Official Account** | 用戶看到的 Bot 帳號 | LINE Official Account Manager |
| **LIFF App** | LINE 內嵌網頁（須放在 LINE Login Channel） | LINE Developers Console |

### 憑證用途

| 憑證 | 用途 | 安全性 |
|------|------|--------|
| **Channel Secret** | 驗證 Webhook 請求的簽名 | 僅後端使用，不可外洩 |
| **Channel Access Token** | 呼叫 LINE API (推播、取得用戶資料) | 僅後端使用，不可外洩 |
| **LIFF ID** | 初始化 LIFF SDK | 公開，用於前端 |

### 你的伺服器端

| 元件 | 路徑 | 功能 |
|------|------|------|
| **Webhook Handler** | `/api/webhook` | 接收 LINE 事件 |
| **LIFF 頁面** | `/liff/*` | 購物、訂單等 UI |
| **API Routes** | `/api/*` | 商品、訂單 CRUD |
| **LINE SDK 封裝** | `/lib/line/*` | 推播、回覆、Flex Message |

---

## 兩個管理後台的分工

```
┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐
│     LINE Developers Console         │  │   LINE Official Account Manager     │
│     developers.line.biz             │  │   manager.line.biz                  │
├─────────────────────────────────────┤  ├─────────────────────────────────────┤
│                                     │  │                                     │
│  ✓ 建立/管理 Provider               │  │  ✓ 建立 LINE Official Account       │
│  ✓ 查看 Channel 憑證                │  │  ✓ 啟用 Messaging API               │
│    • Channel Secret                 │  │  ✓ 設定帳號名稱/頭像                │
│    • Channel Access Token           │  │  ✓ 查看好友數/訊息統計              │
│  ✓ 設定 Webhook URL                 │  │  ✓ 關閉自動回應訊息                 │
│  ✓ 建立/管理 LIFF App               │  │  ✓ 手動發送訊息 (群發)              │
│  ✓ 查看 API 呼叫統計                │  │  ✓ 設定圖文選單 (Rich Menu)         │
│                                     │  │                                     │
│  【開發者視角】                      │  │  【營運者視角】                      │
│                                     │  │                                     │
└─────────────────────────────────────┘  └─────────────────────────────────────┘
```

---

## 完整請求流程範例

**用戶發送「下單」訊息：**

```
1. 用戶 LINE App
   └─► 發送「下單」到 Bot

2. LINE Platform
   └─► 建立 Webhook Event (type: message)
   └─► POST 到你設定的 Webhook URL
   └─► Header 包含 x-line-signature (HMAC-SHA256 簽名)

3. 你的伺服器 /api/webhook
   └─► 用 Channel Secret 驗證簽名
   └─► 解析 event.message.text = "下單"
   └─► 判斷包含「下單」關鍵字
   └─► 建立 Flex Message (含 LIFF 連結)
   └─► 呼叫 LINE Reply API

4. LINE Platform
   └─► 收到回覆請求
   └─► 將 Flex Message 推送給用戶

5. 用戶 LINE App
   └─► 收到包含「立即下單」按鈕的訊息
   └─► 點擊按鈕 → 開啟 LIFF (line://app/xxx)

6. LINE WebView
   └─► 載入 your-app.com/liff
   └─► LIFF SDK 初始化，取得用戶資料
   └─► 顯示商品列表
```
