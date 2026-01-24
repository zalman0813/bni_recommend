# LINE Webhook Events - Receiving Messages

**Source:** https://developers.line.biz/en/docs/messaging-api/receiving-messages/

**Last Updated:** 2025-12-23

---

## Overview

LINE Platform 會在使用者與你的官方帳號互動時，向你註冊的 bot server 發送包含 webhook event objects 的 HTTP POST requests。

**重要提醒：** 你的 bot server 可能會收到來自非 LINE Platform 的 HTTP POST requests，因此建議在處理事件前先驗證簽章。

---

## Security & Verification

### Webhook Signature Verification

**必須實作：** 在處理任何事件前，驗證 request header 中的 webhook signature。這可以確認：
- Request 來自 LINE Platform
- 傳輸過程中未被竄改

詳細的簽章驗證方法請參考 LINE 官方文件的 webhook signature 專區。

---

## Webhook Event Types

### Chat Events Summary

| Event Type | Trigger Condition | One-on-One | Group/Multi | Replyable |
|-----------|-------------------|------------|-------------|-----------|
| **Message** | 使用者發送訊息 | ✅ | ✅ | ✅ |
| **Unsend** | 使用者收回訊息 | ✅ | ✅ | ❌ |
| **Follow** | 使用者加入好友/解除封鎖 | ✅ | ❌ | ✅ |
| **Unfollow** | 使用者封鎖帳號 | ✅ | ❌ | ❌ |
| **Join** | Bot 加入群組/多人聊天室 | ❌ | ✅ | ✅ |
| **Leave** | 使用者移除 bot 或 bot 離開 | ❌ | ✅ | ❌ |
| **Member Join** | 使用者加入含 bot 的聊天室 | ❌ | ✅ | ✅ |
| **Member Leave** | 使用者離開含 bot 的聊天室 | ❌ | ✅ | ❌ |
| **Postback** | 使用者觸發 postback action | ✅ | ✅ | ✅ |
| **Video Viewing Complete** | 使用者看完帶 tracking ID 的影片 | ✅ | ✅ | ✅ |

### Other Events

- **Beacon Event:** 使用者進入 beacon 範圍時觸發 (可回覆)
- **Account Link Event:** 使用者連結 LINE 帳號時觸發 (可回覆)

---

## Event Details

### Message Event with Quote Reference

當使用者回覆先前的訊息時，webhook 會包含 `quotedMessageId` 屬性：

```json
{
  "message": {
    "type": "text",
    "id": "468789577898262530",
    "quotedMessageId": "468789532432007169",
    "quoteToken": "q3Plxr4AgKd...",
    "text": "User's reply text"
  }
}
```

**注意：** 你可以識別被引用的訊息 ID，但無法取得其內容。

---

### Message Event with Bot Mention

當使用者提及你的 bot 時，webhook 會包含 mention metadata：

```json
{
  "message": {
    "type": "text",
    "text": "@example_bot Good Morning!!",
    "mention": {
      "mentionees": [
        {
          "index": 0,
          "length": 12,
          "userId": "{bot_user_id}",
          "type": "user",
          "isSelf": true
        }
      ]
    }
  }
}
```

**欄位說明：**
- `index`: 提及文字的起始位置
- `length`: 提及文字的長度
- `userId`: 被提及者的 user ID
- `isSelf`: 是否提及自己 (bot)

---

### Unsend Event Handling

當收到 unsend events 時，應實作適當的資料處理：

1. 取消在管理系統中的訊息顯示
2. 從資料庫刪除已儲存的訊息
3. 防止未來存取已收回的內容

**重要：** Unsend event 不可回覆 (non-replyable)

---

## Webhook Redelivery

### Configuration

**預設狀態：** 停用

**啟用步驟：**
1. 進入 LINE Developers Console 的 channel settings
2. 導航至 Messaging API tab
3. 啟用 "Use webhook"
4. 啟用 "Webhook redelivery"

### Redelivery Conditions

- 功能必須已啟用
- Bot server 未回傳 `2xx` status code
- LINE Platform 會以未公開的間隔重試

### Important Caveats

**不保證可靠傳遞：** Redelivery 不保證 100% 可靠傳遞。如果重傳影響平台運作，LINE 可能會停用該功能。

### Handling Duplicate Events

使用以下方法處理重複事件：

1. **使用 `webhookEventId`** 偵測重複事件
2. **檢查 `deliveryContext.isRedelivery` flag** 識別重傳的 webhook
3. **檢查 `timestamp`** 確認事件的時間順序

```json
{
  "webhookEventId": "01FZ74A0TDDPYRVKNK77XKC3ZR",
  "deliveryContext": {
    "isRedelivery": true
  },
  "timestamp": 1625665242211
}
```

---

## Content Retrieval APIs

### 1. Get User-Sent Content

取得使用者發送的媒體內容（圖片、影片、音訊、檔案）。

**Endpoint:**
```
GET https://api-data.line.me/v2/bot/message/{messageId}/content
```

**Headers:**
```
Authorization: Bearer {channel_access_token}
```

**注意：** 內容會在指定期限後自動刪除

---

### 2. Get Preview Images

取得預覽圖片，適合用於 CRM 系統的縮圖顯示。

**Endpoint:**
```
GET https://api-data.line.me/v2/bot/message/{messageId}/content/preview
```

**Headers:**
```
Authorization: Bearer {channel_access_token}
```

---

### 3. Get User Profile

取得使用者的個人資料。

**Endpoint:**
```
GET https://api.line.me/v2/bot/profile/{userId}
```

**Headers:**
```
Authorization: Bearer {channel_access_token}
```

**Response:**
```json
{
  "displayName": "User Display Name",
  "userId": "U1234567890abcdef1234567890abcdef",
  "pictureUrl": "https://profile.line-scdn.net/...",
  "statusMessage": "User's status message"
}
```

---

## Best Practices

### 1. Asynchronous Processing
非同步處理 webhook events 以防止 request backlog

```python
# Example pattern
async def handle_webhook(event):
    # Queue the event for processing
    await event_queue.put(event)
    return 200  # Return immediately

async def process_events():
    while True:
        event = await event_queue.get()
        # Process event here
        await handle_event(event)
```

### 2. Signature Verification
**務必在處理前驗證 webhook signatures**

```python
# Example verification
import hmac
import hashlib
import base64

def verify_signature(body, signature, channel_secret):
    hash = hmac.new(
        channel_secret.encode('utf-8'),
        body.encode('utf-8'),
        hashlib.sha256
    ).digest()
    expected_signature = base64.b64encode(hash).decode('utf-8')
    return signature == expected_signature
```

### 3. Timestamp Checking
使用 event `timestamp` 確認時間順序，特別是在有 redelivery 的情況下

### 4. Duplicate Detection
利用 `webhookEventId` 識別並處理重複事件

```python
# Example duplicate detection
processed_events = set()

def is_duplicate(webhook_event_id):
    if webhook_event_id in processed_events:
        return True
    processed_events.add(webhook_event_id)
    return False
```

### 5. Error Monitoring
利用 webhook error statistics 功能診斷傳遞問題

### 6. Response Time
盡快回傳 HTTP 200 response，避免觸發 redelivery

**建議架構：**
- 收到 webhook → 立即驗證簽章 → 回傳 200
- 將 event 放入 queue → 非同步處理

---

## Common Event Structures

### Base Webhook Request Body

```json
{
  "destination": "xxxxxxxxxx",
  "events": [
    {
      "type": "message",
      "message": {
        "type": "text",
        "id": "468789577898262530",
        "text": "Hello, world"
      },
      "webhookEventId": "01FZ74A0TDDPYRVKNK77XKC3ZR",
      "deliveryContext": {
        "isRedelivery": false
      },
      "timestamp": 1625665242211,
      "source": {
        "type": "user",
        "userId": "U4af4980629..."
      },
      "replyToken": "b60d432864f44d079f6d8efe86cf404b",
      "mode": "active"
    }
  ]
}
```

### Common Event Properties

| Property | Type | Description |
|----------|------|-------------|
| `type` | String | Event type (message, follow, join, etc.) |
| `webhookEventId` | String | Webhook event ID for duplicate detection |
| `deliveryContext` | Object | Contains `isRedelivery` flag |
| `timestamp` | Number | Time of event occurrence (milliseconds) |
| `source` | Object | Event source (user, group, room) |
| `replyToken` | String | Token for replying (valid for replyable events) |
| `mode` | String | Channel mode (active, standby) |

---

## Resources

- **Official Documentation:** https://developers.line.biz/en/docs/messaging-api/receiving-messages/
- **Webhook Signature Verification:** https://developers.line.biz/en/docs/messaging-api/receiving-messages/#verifying-signatures
- **Event Object Reference:** https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects
- **LINE Developers Console:** https://developers.line.biz/console/

---

## Notes

- 內容會以繁體中文說明，但程式碼範例使用英文註解
- 這是 solo dev 專案的參考文件，保持簡潔實用
- 所有 API endpoints 需要有效的 channel access token
- 媒體內容有儲存期限，請及時下載需要保存的內容
