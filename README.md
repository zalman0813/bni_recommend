# BNI 引薦回報自動化系統

LINE Bot + Google Apps Script (GAS) + Google Sheets 系統，用於 BNI 小組每週引薦數據回報。

## 架構

```
LINE App ──▶ GAS (Webhook) ──▶ Google Sheets
    ▲                              │
    └──────── LINE API ◀───────────┘
```

## 功能特色

- **對話式回報**：透過 LINE 問答流程收集引薦數據
- **自動週報表**：每週自動建立新分頁 (YYYY-Www 格式)
- **時間管制**：週四 06:00 ~ 週三 23:00 開放回報
- **角色分流**：組員/組長不同功能選單
- **智慧摘要**：依條件顯示回報結果

## 專案結構

```
gas/
├── appsscript.json        # GAS 專案設定
├── Code.gs                # 主入口 (doPost)
├── Config.gs              # 設定檔 (Token, Sheet ID)
├── LineApi.gs             # LINE API 封裝
├── RichMenu.gs            # Rich Menu 管理
├── SheetDb.gs             # Sheets 資料庫操作
├── StateMachine.gs        # 對話狀態機
├── TimeUtils.gs           # 時間管制
├── MessageBuilder.gs      # 訊息建構
└── LeaderFunctions.gs     # 組長功能
```

## 快速開始

詳細部署步驟請參考 [SETUP.md](./SETUP.md)

### 前置需求

1. LINE Developers Console 帳號
2. Google 帳號
3. Rich Menu 圖檔 x3

### 簡要步驟

1. 建立 LINE Messaging API Channel
2. 建立 Google Sheets 並設定 Member_List 分頁
3. 建立 GAS 專案並複製程式碼
4. 設定 Script Properties
5. 部署 Web App
6. 設定 LINE Webhook URL
7. 執行 `createAllRichMenus()` 建立選單
8. 上傳 Rich Menu 圖檔

## Rich Menu 規格

| 選單 | 尺寸 | 按鈕 |
|------|------|------|
| Unbound | 2500x843 | 啟動姓名綁定 |
| Member | 2500x843 | 我要回報、查看本週數據 |
| Leader | 2500x1686 | 我要回報、查看數據、已回報、未回報、雲端總覽 |

## 資料庫設計

### Member_List (固定)

| 欄位 | 說明 |
|------|------|
| LINE用戶ID | LINE 唯一識別碼 |
| 真實姓名 | 成員真實姓名 |
| 小組名稱 | 所屬小組 |
| 角色 | 組長 / 幹部 / 組員 |
| 狀態 | 啟用 / 停用 |

### Group_List (固定)

| 欄位 | 說明 |
|------|------|
| 小組名稱 | 小組名稱 |

### YYYY-Www (動態週報)

| 欄位 | 說明 |
|------|------|
| 更新時間 | 最後更新時間 |
| 小組名稱 | 所屬小組 |
| 成員姓名 | 成員姓名 |
| 內部引薦 | 內部引薦張數 |
| 內部備註 | 內部引薦對象 |
| 外部引薦 | 外部引薦張數 |
| 外部備註 | 外部引薦說明 |
| 總金額 | 內外總金額 |
| 121次數 | 1對1 次數 |

## 授權

MIT License
