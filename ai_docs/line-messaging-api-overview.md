# LINE Messaging API Overview

**Source:** https://developers.line.biz/en/docs/messaging-api/overview/
**Retrieved:** 2025-12-23

---

## What is LINE Official Account

LINE Official Account 的完整資訊可在 LINE Campus 學習平台上找到（僅提供日文版本）。

---

## How the Messaging API Works

Messaging API 使用三步驟的通訊流程：

1. **使用者發送訊息** - 使用者向 LINE Official Account 發送訊息
2. **Webhook 事件傳送** - LINE Platform 將 webhook 事件發送到 bot server 的 webhook URL
3. **Bot 回應** - Bot server 處理事件並通過 LINE Platform 回應使用者

**技術規格：**
- 所有請求使用 HTTPS
- 資料格式為 JSON

---

## Demo & Testing

LINE API Use Case 網站提供功能示範：
- 使用者可以將 Official Accounts 加為好友
- 體驗已實作的功能
- 提供可存取的程式碼範例

---

## Capabilities

### Message Sending

**回覆訊息：**
- 回覆使用者訊息
- 主動推送訊息（任何時間發送）

**支援的訊息類型：**
- Text（文字）
- Stickers（貼圖）
- Images（圖片）
- Video（影片）
- Audio（音訊）
- Location（位置）
- Coupons（優惠券）
- Imagemaps（圖像地圖）
- Templates（範本訊息）
- Flex Messages（彈性訊息）

### User Interaction

**使用者內容存取：**
- 取得使用者產生的內容（圖片、影片、音訊、檔案）

**使用者資料存取：**
- Display name（顯示名稱）
- Language（語言設定）
- Profile image（個人圖片）
- Status message（狀態訊息）

**群組功能：**
- 參與群組聊天
- 取得群組成員資訊

**UI 自訂：**
- Rich menu 客製化

### Advanced Features

**Beacon 整合：**
- 基於位置的互動功能

**帳號連結：**
- 在您的服務與 LINE 帳號之間建立安全的帳號連結

**配額管理：**
- 訊息配額追蹤
- 消費報告

---

## Pricing Structure

**免費訊息額度：**
每月可免費發送一定數量的訊息。免費訊息數量取決於 LINE Official Account 的訂閱方案。

**區域定價：**
不同地區的價格有所不同，詳細資訊請參閱專門的定價文件。

---

## Next Steps

**新開發者入門流程：**

### 詳細設定步驟

完整的設定流程請參閱 `line-getting-started.md`，包含：

#### 1. 建立 LINE Official Account
- 使用 LINE 帳號或 Email 註冊 Business ID
- 填寫 Entry Form
- 在 LINE Official Account Manager 中管理帳號

#### 2. 選擇 Channel Provider
- Provider 用於管理多個 channels
- **⚠️ 重要：Provider 一旦指定後無法更改**
- 建議在專案開始前規劃 Provider 結構

#### 3. 啟用 Messaging API
- 從 LINE Official Account Manager 啟用 Messaging API
- 系統自動建立對應的 Messaging API channel
- **註：2024年9月起無法直接從 Developers Console 建立 channel**

#### 4. 開發者註冊
- 首次登入 LINE Developers Console 需註冊
- 提供開發者姓名與 Email
- 註冊後可存取所有相關 channels

#### 5. 取得開發憑證
- **Channel Access Token**（推薦使用 v2.1，可自訂過期時間）
- **Channel Secret**（用於 webhook 簽章驗證）

#### 6. 設定 Webhook URL
- 必須使用 HTTPS（不接受自簽憑證）
- 設定後進行驗證測試
- 啟用 "Use webhook" 開關

#### 7. 配置 Official Account
- 關閉自動問候與回應訊息
- 自訂商業檔案（照片、封面、按鈕）

#### 8. 測試與驗證
- 掃描 QR Code 將 Bot 加為好友
- 測試 webhook 事件接收
- 驗證訊息回覆功能

**快速參考：**
- 詳細步驟：參閱 `line-getting-started.md`
- Webhook 處理：參閱 `line-webhook-events.md`
- SDK 使用：參閱 `line-bot-sdk-python.md`

---

## Additional Resources

- LINE Campus 學習平台
- LINE API Use Case 網站
- 定價文件（依地區而異）

---

*此文件為開發者參考資料，包含 LINE Messaging API 的核心概念與技術細節。*
