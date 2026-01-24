# LINE Official Account 與 Messaging API 完整設定指南

**Source:** https://developers.line.biz/en/docs/messaging-api/getting-started/ & https://developers.line.biz/en/docs/messaging-api/building-bot/
**Retrieved:** 2025-01-09

---

## 概述

本文件提供從零開始建立 LINE Bot 的完整流程，包括 LINE Official Account 建立、Channel Provider 管理、Messaging API 啟用，以及開發環境設定。

---

## 前置準備

### 所需資源
- LINE 帳號或 Email（用於註冊）
- HTTPS 伺服器（用於接收 webhook）
- SSL/TLS 證書（必須是受信任的憑證，**不接受自簽憑證**）

---

## 步驟一：建立 LINE Official Account

### 1.1 註冊 Business ID

1. 前往 [LINE Official Account Manager](https://manager.line.biz/)
2. 使用 LINE 帳號或 Email 註冊
3. 填寫 Entry Form（商業資訊）
4. 完成後，LINE Official Account 會出現在管理介面

### 1.2 LINE Official Account 類型

LINE Official Account 有不同的訂閱方案：
- **Free Plan**: 每月免費訊息額度
- **Light/Standard Plan**: 更高的訊息額度與功能

詳細定價依地區而異，請參閱官方定價頁面。

---

## 步驟二：選擇與管理 Provider

### 2.1 什麼是 Provider？

**Provider** 是用來管理多個 LINE channels 的組織單位。它可以是：
- 個人開發者帳號
- 公司組織
- 專案團隊

### 2.2 建立或選擇 Provider

在啟用 Messaging API 時，系統會要求選擇或建立 Provider：

```
選項：
1. 使用現有 Provider
2. 建立新的 Provider（輸入名稱）
```

### 2.3 ⚠️ 重要限制

**一旦將 Provider 指定給 LINE Official Account，就無法更改或取消指定。**

這對以下情境特別重要：
- 整合多個 channels
- 跨組織管理帳號
- 長期專案規劃

**建議：** 在正式專案開始前，仔細規劃 Provider 結構。

---

## 步驟三：啟用 Messaging API

### 3.1 從 LINE Official Account Manager 啟用

1. 登入 [LINE Official Account Manager](https://manager.line.biz/)
2. 選擇你的 Official Account
3. 點擊 **設定** > **Messaging API**
4. 點擊 **啟用 Messaging API**
5. 選擇或建立 Provider
6. 確認啟用

**結果：** 系統會自動建立對應的 **Messaging API channel**

### 3.2 ⚠️ 2024年9月起的重要變更

**無法直接從 LINE Developers Console 建立 Messaging API channel。**

所有 channel 建立必須透過 LINE Official Account Manager 的 Messaging API 啟用流程。

---

## 步驟四：開發者註冊

### 4.1 首次登入 LINE Developers Console

如果你的帳號首次登入 [LINE Developers Console](https://developers.line.biz/console/)，需要完成開發者註冊：

1. 登入 Console（使用 LINE Official Account Manager 的帳號）
2. 填寫開發者資訊：
   - **姓名**
   - **Email**
3. 同意開發者條款
4. 完成註冊

註冊後，你就可以存取所有與你 Provider 相關的 channels。

---

## 步驟五：取得開發憑證

### 5.1 Channel Access Token

**推薦使用：Channel Access Token v2.1**

#### 取得步驟：
1. 登入 [LINE Developers Console](https://developers.line.biz/console/)
2. 選擇你的 **Provider**
3. 點擊你的 **Messaging API channel**
4. 前往 **Messaging API** 頁籤
5. 在 **Channel access token** 區塊點擊 **Issue**
6. 選擇 Token 類型：
   - **Channel access token v2.1**（推薦，可自訂過期時間）
   - Stateless channel access token
   - Short-lived channel access token
   - Long-lived channel access token
7. 設定過期時間（v2.1）
8. 點擊 **Issue** 並複製 token

**⚠️ 安全提醒：**
- Token 只會顯示一次，請立即儲存到環境變數
- 絕不要將 token 寫入程式碼或版本控制系統
- 使用 `.env` 檔案並加入 `.gitignore`

### 5.2 Channel Secret

1. 在同一個 channel 頁面
2. 找到 **Basic settings** 頁籤
3. **Channel secret** 會顯示在頁面上
4. 點擊 **Show** 查看並複製

**用途：** 用於驗證 webhook 請求的簽章（HMAC-SHA256）

---

## 步驟六：設定 Webhook URL

### 6.1 配置 Webhook 端點

1. 在 **Messaging API** 頁籤
2. 找到 **Webhook settings** 區塊
3. 點擊 **Edit**
4. 輸入你的 webhook URL：
   ```
   https://your-domain.com/callback
   ```
5. 點擊 **Update**
6. 點擊 **Verify** 測試連線
   - 系統會發送 POST 請求到你的端點
   - 你的伺服器必須回應 HTTP 200
7. 啟用 **Use webhook** 開關

### 6.2 Webhook 要求

**必須條件：**
- ✅ 使用 HTTPS 協定
- ✅ 使用受信任的 SSL/TLS 證書（TLS 1.2+）
- ❌ 不接受自簽憑證
- ✅ 必須在合理時間內回應 HTTP 200

**開發階段建議：**
- 使用 [ngrok](https://ngrok.com/) 建立 HTTPS tunnel
- 或部署到支援 HTTPS 的雲端服務（Heroku, Railway, Render 等）

---

## 步驟七：LINE Official Account Manager 設定

### 7.1 關閉自動回覆功能

**為什麼要關閉？**
- 避免自動回覆與 Bot 程式回覆衝突
- 確保由 Messaging API 完全控制對話流程

#### 關閉步驟：
1. 登入 [LINE Official Account Manager](https://manager.line.biz/)
2. 選擇你的 Official Account
3. 前往 **回應設定**
4. 關閉以下功能：
   - **問候訊息**（Greeting message）
   - **自動回應訊息**（Auto-reply message）
5. 啟用 **Webhook**

### 7.2 自訂商業檔案（選用）

優化使用者體驗：
- 上傳 **個人資料照片**（Profile photo）
- 設定 **封面圖片**（Cover image）
- 自訂 **按鈕**（Action buttons）

---

## 步驟八：測試與驗證

### 8.1 將 Bot 加為好友

1. 在 **Messaging API** 頁籤找到 QR Code
2. 使用 LINE 應用程式掃描 QR Code
3. 將 Official Account 加為好友

### 8.2 驗證 Webhook 連線

**測試封鎖事件：**
1. 將 Bot 加為好友
2. 封鎖 Bot
3. 檢查伺服器 log 是否收到 `unfollow` 事件
4. 解除封鎖
5. 檢查是否收到 `follow` 事件

**測試訊息事件：**
1. 發送文字訊息給 Bot
2. 檢查伺服器是否收到 `message` 事件
3. 確認 `reply_token` 可正常使用

---

## 步驟九：環境變數設定

### 9.1 建立 .env 檔案

```bash
# LINE Bot Configuration
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token_here
LINE_CHANNEL_SECRET=your_channel_secret_here
WEBHOOK_URL=https://your-domain.com/callback
```

### 9.2 .gitignore 設定

```gitignore
# Environment variables
.env
.env.local

# LINE credentials
*_token.txt
*_secret.txt
```

---

## 步驟十：安全性設定（選用）

### 10.1 IP 白名單

適用於 Long-lived channel access token：

1. 前往 **Security** 頁籤
2. 註冊允許的 IP 位址
3. 支援格式：
   - 單一 IP：`203.0.113.1`
   - CIDR 格式：`203.0.113.0/24`

---

## 常見問題

### Q1: 可以更改 Provider 嗎？
**A:** 不可以。一旦指定 Provider 給 Official Account 就無法更改。

### Q2: 可以在本地開發環境測試嗎？
**A:** 可以，使用 ngrok 等工具建立 HTTPS tunnel：
```bash
ngrok http 5000
```
然後將產生的 HTTPS URL 設定為 webhook URL。

### Q3: 為什麼 webhook 驗證失敗？
**A:** 常見原因：
- 伺服器尚未啟動
- 未使用 HTTPS
- 使用自簽憑證
- 防火牆阻擋 LINE Platform IP
- 伺服器回應時間過長

### Q4: Channel Access Token 過期怎麼辦？
**A:**
- 使用 v2.1 token 可自訂過期時間
- Token 過期前重新 issue 新的 token
- 更新環境變數並重啟服務

### Q5: 可以用同一個 Provider 管理多個 Bot 嗎？
**A:** 可以。一個 Provider 可以管理多個 Messaging API channels。

---

## 下一步

完成設定後，你可以：

1. **實作 Webhook 處理**
   - 參考 `line-webhook-events.md`
   - 實作簽章驗證

2. **發送訊息**
   - 參考 `line-message-types.md`
   - 學習各種訊息格式

3. **使用 Python SDK**
   - 參考 `line-bot-sdk-python.md`
   - 快速開發 Bot 功能

4. **設計 Flex Messages**
   - 參考 `line-flex-messages.md`
   - 建立豐富的互動介面

---

## 相關資源

### 官方平台
- [LINE Developers Console](https://developers.line.biz/console/)
- [LINE Official Account Manager](https://manager.line.biz/)
- [LINE Campus 學習平台](https://campus.line.biz/)（日文）

### 開發文件
- [Messaging API 總覽](https://developers.line.biz/en/docs/messaging-api/overview/)
- [Messaging API 參考](https://developers.line.biz/en/reference/messaging-api/)
- [Python SDK GitHub](https://github.com/line/line-bot-sdk-python)

### 測試工具
- [ngrok](https://ngrok.com/) - HTTPS Tunnel
- [Flex Message Simulator](https://developers.line.biz/console/) - Flex 訊息設計工具
- [LINE API Use Case](https://lineapiusecase.com/) - 功能示範

---

*此文件提供 LINE Official Account 與 Messaging API 的完整設定流程，適合初次使用 LINE Bot 的開發者參考。*
