# LINE Webhook Signature Verification

## Source
- **官方文件**: [Verify webhook signature | LINE Developers](https://developers.line.biz/en/docs/messaging-api/verify-webhook-signature/)
- **Node.js SDK**: [Webhook Guide](https://line.github.io/line-bot-sdk-nodejs/guide/webhook.html)
- **Python SDK**: [line-bot-sdk-python](https://github.com/line/line-bot-sdk-python)
- **Java SDK**: [line-bot-sdk-java](https://github.com/line/line-bot-sdk-java)

---

## 概述 (Overview)

LINE webhook signature 驗證確保 webhook 請求確實來自 LINE Platform，而非偽造或篡改的請求。這是建立 LINE bot 伺服器的重要安全措施。

**驗證原理**: LINE Platform 與 bot server 都使用相同的 hash key (channel secret) 進行 HMAC-SHA256 計算，透過比對簽章來驗證請求的合法性。

---

## 技術規格 (Technical Specifications)

| 項目 | 說明 |
|------|------|
| **Header Name** | `x-line-signature` |
| **Algorithm** | HMAC-SHA256 |
| **Encoding** | Base64 |
| **Character Encoding** | UTF-8 (必須) |
| **Content-Type** | `application/json; charset=utf-8` |

---

## 驗證流程 (Verification Process)

### 三步驟流程

1. **LINE Platform 發送 webhook**
   - 使用 webhook event body 作為輸入資料
   - 使用 channel secret 作為 hash key
   - 產生 HMAC-SHA256 簽章
   - 將簽章放入 `x-line-signature` header 中發送

2. **Bot server 接收 webhook**
   - 儲存收到的簽章 (來自 header)
   - 儲存原始 request body 字串 (不做任何修改)

3. **Bot server 驗證**
   - 使用相同的輸入 (body + channel secret) 重新計算簽章
   - 比對計算結果與收到的簽章是否相同

---

## 關鍵實作規則 (Critical Implementation Rules)

### ⚠️ 驗證前絕對不可修改資料

**重要**: 在驗證簽章之前，**不可對簽章或 request body 字串進行任何修改**。任何修改都會導致驗證失敗。

禁止的操作包括:
- ❌ 解析或反序列化 JSON body
- ❌ 格式化 JSON (加入空白、換行等)
- ❌ 解讀跳脫字元 (如 `\n`, `\`)
- ❌ 使用非 UTF-8 編碼
- ❌ 字串替換或轉換

**正確做法**: 使用原始的 request body 字串，完全不做任何處理。

---

## 取得 Channel Secret

1. 前往 [LINE Developers Console](https://developers.line.biz/console/)
2. 選擇你的 Messaging API channel
3. 進入 **Basic settings** 標籤頁
4. 複製 **Channel secret** (需要管理員權限)

⚠️ Channel secret 是私密金鑰，只有 LINE Platform 和開發者知道。請妥善保管。

---

## 程式碼範例 (Code Examples)

### Python (使用 line-bot-sdk)

```python
from flask import Flask, request, abort
from linebot.v3 import WebhookHandler
from linebot.v3.exceptions import InvalidSignatureError
from linebot.v3.messaging import (
    Configuration,
    ApiClient,
    MessagingApi,
    ReplyMessageRequest,
    TextMessage
)
from linebot.v3.webhooks import MessageEvent, TextMessageContent

app = Flask(__name__)

configuration = Configuration(access_token='YOUR_CHANNEL_ACCESS_TOKEN')
handler = WebhookHandler('YOUR_CHANNEL_SECRET')

@app.route("/callback", methods=['POST'])
def callback():
    # Get X-Line-Signature header value
    signature = request.headers['X-Line-Signature']

    # Get request body as text (raw string)
    body = request.get_data(as_text=True)
    app.logger.info("Request body: " + body)

    # Handle webhook body with signature verification
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        app.logger.info("Invalid signature. Request is not from LINE Platform.")
        abort(400)

    return 'OK'

# Event handlers
@handler.add(MessageEvent, message=TextMessageContent)
def handle_message(event):
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        line_bot_api.reply_message_with_http_info(
            ReplyMessageRequest(
                reply_token=event.reply_token,
                messages=[TextMessage(text=event.message.text)]
            )
        )

if __name__ == "__main__":
    app.run(port=8000)
```

---

### Node.js (使用 @line/bot-sdk)

```javascript
import express from 'express';
import { middleware, JSONParseError, SignatureValidationFailed } from '@line/bot-sdk';

const app = express();

const config = {
  channelSecret: 'YOUR_CHANNEL_SECRET',
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN'
};

// Use middleware for automatic signature verification
app.use(middleware(config));

app.post('/webhook', (req, res) => {
  // If code reaches here, signature is already verified
  console.log('Received events:', req.body.events);

  // Process events
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.json({ status: 'ok' }))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// Error handling for signature validation
app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    console.error('Signature validation failed:', err.signature);
    res.status(401).send('Invalid signature');
    return;
  } else if (err instanceof JSONParseError) {
    console.error('JSON parse error:', err.raw);
    res.status(400).send('Invalid JSON');
    return;
  }
  next(err);
});

function handleEvent(event) {
  // Handle different event types
  if (event.type === 'message' && event.message.type === 'text') {
    console.log('Message:', event.message.text);
  }
}

app.listen(8080, () => {
  console.log('Webhook server listening on port 8080');
});
```

**Manual verification** (不使用 middleware):

```javascript
import { validateSignature } from '@line/bot-sdk';
import express from 'express';

const app = express();

const channelSecret = 'YOUR_CHANNEL_SECRET';

app.post('/webhook', express.json(), (req, res) => {
  const signature = req.headers['x-line-signature'];
  const body = JSON.stringify(req.body);

  if (!validateSignature(body, channelSecret, signature)) {
    console.error('Invalid signature');
    return res.status(401).send('Invalid signature');
  }

  // Process webhook events
  console.log('Signature verified successfully');
  res.json({ status: 'ok' });
});

app.listen(8080);
```

---

### Java (手動驗證 HMAC-SHA256)

```java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

public class SignatureValidator {
    private static final String ALGORITHM = "HmacSHA256";

    /**
     * Verify webhook signature
     *
     * @param channelSecret Channel secret string
     * @param httpRequestBody Request body string (raw)
     * @return Base64-encoded signature
     */
    public static String generateSignature(
            final String channelSecret,
            final String httpRequestBody) {
        try {
            Mac mac = Mac.getInstance(ALGORITHM);
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                channelSecret.getBytes("UTF-8"),
                ALGORITHM
            );
            mac.init(secretKeySpec);

            byte[] digest = mac.doFinal(httpRequestBody.getBytes("UTF-8"));
            return Base64.encodeBase64String(digest);

        } catch (NoSuchAlgorithmException
                | InvalidKeyException
                | UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to generate signature", e);
        }
    }

    /**
     * Validate signature from request header
     *
     * @param channelSecret Channel secret
     * @param requestBody Raw request body
     * @param receivedSignature Signature from x-line-signature header
     * @return true if valid, false otherwise
     */
    public static boolean validateSignature(
            String channelSecret,
            String requestBody,
            String receivedSignature) {
        String calculatedSignature = generateSignature(channelSecret, requestBody);
        return calculatedSignature.equals(receivedSignature);
    }
}
```

**Spring Boot 範例**:

```java
@RestController
@RequestMapping("/webhook")
public class WebhookController {

    @Value("${line.bot.channel-secret}")
    private String channelSecret;

    @PostMapping
    public ResponseEntity<String> callback(
            @RequestHeader("x-line-signature") String signature,
            @RequestBody String body) {

        // Verify signature
        if (!SignatureValidator.validateSignature(channelSecret, body, signature)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid signature");
        }

        // Process webhook events
        // ... your event handling logic

        return ResponseEntity.ok("OK");
    }
}
```

---

### OpenSSL Command Line (測試用)

```bash
# Verify signature manually using OpenSSL
echo -n '{"destination":"U8e742f61d673b39c7fff3cecb7536ef0","events":[]}' | \
openssl dgst -sha256 -hmac '8c570fa6dd201bb328f1c1eac23a96d8' -binary | \
openssl base64

# Expected output: GhRKmvmHys4Pi8DxkF4+EayaH0OqtJtaZxgTD9fMDLs=
```

參數說明:
- `-n`: echo 不加換行
- `dgst -sha256`: 使用 SHA256 雜湊
- `-hmac 'SECRET'`: 使用 HMAC 模式，SECRET 是你的 channel secret
- `-binary`: 輸出二進位格式
- `base64`: 轉換為 Base64 編碼

---

## 常見失敗原因 (Common Failure Points)

### 1. 修改 Request Body
❌ **錯誤**: 在驗證前解析 JSON
```python
# Wrong: parsing before verification
data = json.loads(request.body)
handler.handle(json.dumps(data), signature)  # FAIL!
```

✅ **正確**: 使用原始字串
```python
# Correct: use raw body string
body = request.get_data(as_text=True)
handler.handle(body, signature)  # OK
```

### 2. 使用錯誤的 Channel Secret
- 確認使用正確 channel 的 secret
- Channel secret 可能被其他管理員重新產生
- 不同環境 (開發/正式) 使用不同的 channel

### 3. 字元編碼問題
- 必須使用 UTF-8 編碼
- 非 UTF-8 編碼會導致換行符號、emoji、特殊字元錯誤

### 4. Proxy/Load Balancer 修改內容
- 檢查 proxy 或 load balancer 是否修改 header 或 body
- 確保原始請求內容完整傳遞到應用程式

### 5. 使用錯誤的演算法
- 必須使用 **HMAC-SHA256**
- 不要誤用 HMAC-SHA1 或其他演算法

---

## 安全最佳實務 (Security Best Practices)

### 1. 永遠驗證簽章
所有 webhook 請求都應該驗證簽章，這是 [Messaging API 開發指南](https://developers.line.biz/en/docs/messaging-api/development-guidelines/) 的建議。

### 2. 使用官方 SDK
LINE 官方 SDK 已內建簽章驗證功能，可避免實作錯誤:
- ✅ **Java**: [line-bot-sdk-java](https://github.com/line/line-bot-sdk-java)
- ✅ **Python**: [line-bot-sdk-python](https://github.com/line/line-bot-sdk-python)
- ✅ **Node.js**: [@line/bot-sdk](https://github.com/line/line-bot-sdk-nodejs)
- ✅ **PHP**: [line-bot-sdk-php](https://github.com/line/line-bot-sdk-php)
- ✅ **Go**: [line-bot-sdk-go](https://github.com/line/line-bot-sdk-go)
- ✅ **Ruby**: [line-bot-sdk-ruby](https://github.com/line/line-bot-sdk-ruby)

### 3. 不要使用 IP 白名單
❌ **不建議**: 限制 LINE Platform 的 IP 位址
- LINE 的 IP 位址可能會變更
- 無法涵蓋所有可能的來源 IP

✅ **建議**: 使用簽章驗證來拒絕未經授權的請求

### 4. 妥善保管 Channel Secret
- 不要將 channel secret 寫死在程式碼中
- 使用環境變數或密鑰管理系統
- 定期輪換 channel secret (如有疑慮)

### 5. 記錄驗證失敗
```python
# Log invalid signature attempts for security monitoring
try:
    handler.handle(body, signature)
except InvalidSignatureError:
    logger.warning(
        f"Invalid signature from IP: {request.remote_addr}, "
        f"Signature: {signature[:20]}..."
    )
    abort(400)
```

---

## 除錯提示 (Debugging Tips)

### 檢查簽章計算
```python
import hashlib
import hmac
import base64

def calculate_signature(channel_secret, body):
    """Calculate signature for debugging"""
    secret = channel_secret.encode('utf-8')
    message = body.encode('utf-8')

    signature = hmac.new(secret, message, hashlib.sha256).digest()
    return base64.b64encode(signature).decode('utf-8')

# Compare with received signature
calculated = calculate_signature(CHANNEL_SECRET, request_body)
received = request.headers.get('x-line-signature')

print(f"Calculated: {calculated}")
print(f"Received:   {received}")
print(f"Match:      {calculated == received}")
```

### 檢查 Request Body
```python
# Log raw body for inspection
body = request.get_data(as_text=True)
print(f"Body length: {len(body)}")
print(f"Body (first 100 chars): {body[:100]}")
print(f"Body encoding: {request.charset}")  # Should be utf-8
```

---

## 參考資源 (References)

- [LINE Developers - Verify webhook signature](https://developers.line.biz/en/docs/messaging-api/verify-webhook-signature/)
- [LINE Developers - Messaging API development guidelines](https://developers.line.biz/en/docs/messaging-api/development-guidelines/)
- [LINE Messaging API SDKs](https://developers.line.biz/en/docs/messaging-api/line-bot-sdk/)
- [Node.js SDK Webhook Guide](https://line.github.io/line-bot-sdk-nodejs/guide/webhook.html)

---

**最後更新**: 2025-12-23
