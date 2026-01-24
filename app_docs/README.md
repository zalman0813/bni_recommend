# 團購 LINE 智慧管家 - 文檔索引

> **Code is the single source of truth.**
> 本文檔僅列出重點功能與檔案路徑對照，詳細實作請參考程式碼。

## 文檔索引

| 文檔 | 說明 |
|------|------|
| [architecture.md](./architecture.md) | 系統架構總覽 |
| [line-architecture.md](./line-architecture.md) | LINE 整合架構圖 ⭐ 新手必讀 |
| [database.md](./database.md) | 資料庫設計 (Prisma Schema) |
| [api-reference.md](./api-reference.md) | API 端點參考 |
| [admin-panel.md](./admin-panel.md) | 後台管理系統 |
| [liff-app.md](./liff-app.md) | LIFF 客人端應用 |
| [line-integration.md](./line-integration.md) | LINE 整合 (Webhook、推播) |
| [setup.md](./setup.md) | 環境設定與部署指南 |

---

## 維護指引表

**修改功能時，請同步更新對應文檔：**

| 修改項目 | 需更新的文檔 |
|---------|-------------|
| 新增/修改 Prisma Model | [database.md](./database.md) |
| 新增/修改 API 路由 | [api-reference.md](./api-reference.md) |
| 新增/修改後台頁面或元件 | [admin-panel.md](./admin-panel.md) |
| 新增/修改 LIFF 頁面或元件 | [liff-app.md](./liff-app.md) |
| 修改 Webhook 事件處理 | [line-integration.md](./line-integration.md) |
| 新增/修改 Flex Message | [line-integration.md](./line-integration.md) |
| 新增環境變數 | [setup.md](./setup.md) |
| 新增套件依賴 | [architecture.md](./architecture.md) |
| 重大架構變更 | [architecture.md](./architecture.md) |

---

## 快速開始

```bash
# 1. 安裝依賴
npm install

# 2. 設定環境變數
cp .env.example .env
# 編輯 .env 填入必要設定

# 3. 初始化資料庫
npx prisma db push
npx prisma generate

# 4. 啟動開發伺服器
npm run dev
```

詳細設定說明請參考 [setup.md](./setup.md)。
