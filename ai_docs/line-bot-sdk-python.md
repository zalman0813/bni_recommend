# LINE Bot SDK for Python - Developer Reference

**Source:** https://github.com/line/line-bot-sdk-python

**Official Documentation:** https://developers.line.biz/en/docs/messaging-api/overview/

**Last Updated:** 2025-12-23

---

## Overview

LINE Bot SDK for Python 是 LINE Messaging API 的官方 Python SDK，讓開發者可以輕鬆建立 LINE Bot。此 SDK 提供 webhook 處理、訊息發送、事件處理等功能。

### Requirements
- Python >= 3.10

---

## Installation

```bash
pip install line-bot-sdk
```

---

## Quick Start

### Basic Configuration

```python
from linebot.v3.messaging import Configuration, ApiClient, MessagingApi

# Initialize configuration with channel access token
configuration = Configuration(access_token='YOUR_CHANNEL_ACCESS_TOKEN')
```

### Flask Echo Bot Example

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

# Initialize handler with channel secret
handler = WebhookHandler('YOUR_CHANNEL_SECRET')

# Initialize configuration
configuration = Configuration(access_token='YOUR_CHANNEL_ACCESS_TOKEN')

@app.route("/callback", methods=['POST'])
def callback():
    # Get X-Line-Signature header value
    signature = request.headers['X-Line-Signature']

    # Get request body as text
    body = request.get_data(as_text=True)
    app.logger.info("Request body: " + body)

    # Handle webhook body
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        app.logger.info("Invalid signature. Please check your channel access token/channel secret.")
        abort(400)

    return 'OK'

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
    app.run()
```

---

## Key Classes and Methods

### 1. Configuration

用於設定 SDK 的基本配置。

```python
from linebot.v3.messaging import Configuration

configuration = Configuration(
    access_token='YOUR_CHANNEL_ACCESS_TOKEN'
)
```

### 2. WebhookParser

用於解析 LINE 傳來的 webhook 請求。

```python
from linebot.v3.webhooks import WebhookParser

parser = WebhookParser(channel_secret='YOUR_CHANNEL_SECRET')

# Parse webhook body
events = parser.parse(body, signature, as_payload=False)
```

**Methods:**
- `__init__(channel_secret, skip_signature_verification=lambda: False)` - Initialize parser
- `parse(body, signature, as_payload=False)` - Parse webhook and return events list or WebhookPayload

### 3. WebhookHandler

使用 decorator 模式處理不同類型的事件。

```python
from linebot.v3 import WebhookHandler
from linebot.v3.webhooks import MessageEvent, FollowEvent, TextMessageContent

handler = WebhookHandler('YOUR_CHANNEL_SECRET')

# Handle text messages
@handler.add(MessageEvent, message=TextMessageContent)
def handle_text_message(event):
    # Handle text message
    pass

# Handle follow events
@handler.add(FollowEvent)
def handle_follow(event):
    # Handle follow event
    pass

# Default handler for unmatched events
@handler.default()
def default(event):
    # Handle other events
    pass

# Process webhook
handler.handle(body, signature)
```

**Methods:**
- `__init__(channel_secret, skip_signature_verification=lambda: False)` - Initialize handler
- `handle(body, signature)` - Process webhooks with registered handlers
- `@handler.add(EventType, message=None)` - Register event handler decorator
- `@handler.default()` - Register default/fallback handler

### 4. MessagingApi

用於發送訊息和操作 LINE Bot API。

```python
from linebot.v3.messaging import MessagingApi, ApiClient

with ApiClient(configuration) as api_client:
    line_bot_api = MessagingApi(api_client)

    # Reply message
    line_bot_api.reply_message(
        ReplyMessageRequest(
            reply_token=event.reply_token,
            messages=[TextMessage(text='Hello!')]
        )
    )

    # Push message
    line_bot_api.push_message(
        PushMessageRequest(
            to='USER_ID',
            messages=[TextMessage(text='Hello!')]
        )
    )
```

---

## Webhook Event Objects

LINE Bot 支援多種 webhook 事件類型：

- **MessageEvent** - 接收訊息事件
- **FollowEvent** - 用戶加入好友事件
- **UnfollowEvent** - 用戶封鎖事件
- **JoinEvent** - Bot 加入群組/聊天室事件
- **LeaveEvent** - Bot 離開群組/聊天室事件
- **PostbackEvent** - Postback 事件
- **BeaconEvent** - Beacon 事件

詳細的 webhook 事件結構請參考：
https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects

### Message Content Types

- **TextMessageContent** - 文字訊息
- **ImageMessageContent** - 圖片訊息
- **VideoMessageContent** - 影片訊息
- **AudioMessageContent** - 音訊訊息
- **LocationMessageContent** - 位置訊息
- **StickerMessageContent** - 貼圖訊息
- **FileMessageContent** - 檔案訊息

---

## Advanced Features

### 1. Getting HTTP Response Information

使用 `*_with_http_info()` 方法可以取得完整的 HTTP response 資訊：

```python
response = line_bot_api.reply_message_with_http_info(
    ReplyMessageRequest(
        reply_token=event.reply_token,
        messages=[TextMessage(text='Hello!')]
    )
)

# Access response details
print(response.status_code)
print(response.headers['x-line-request-id'])
```

### 2. Error Handling

```python
from linebot.v3.messaging import ApiException, ErrorResponse

try:
    line_bot_api.reply_message_with_http_info(request)
except ApiException as e:
    print(f"Status code: {e.status}")
    print(f"Error headers: {e.headers}")

    # Parse error response
    error_response = ErrorResponse.from_json(e.body)
    print(f"Error message: {error_response.message}")
    print(f"Error details: {error_response.details}")
```

### 3. FlexMessage Handling

使用 FlexMessage 創建豐富的互動式訊息：

```python
from linebot.v3.messaging import FlexMessage, FlexContainer
import json

# Load Flex Message JSON
flex_json_string = '''
{
  "type": "bubble",
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "Hello, World!"
      }
    ]
  }
}
'''

# Create FlexMessage
message = FlexMessage(
    alt_text="Hello",
    contents=FlexContainer.from_json(flex_json_string)
)

# Send FlexMessage
line_bot_api.reply_message(
    ReplyMessageRequest(
        reply_token=event.reply_token,
        messages=[message]
    )
)
```

---

## Message Types

### Text Message

```python
from linebot.v3.messaging import TextMessage

message = TextMessage(text='Hello, World!')
```

### Image Message

```python
from linebot.v3.messaging import ImageMessage

message = ImageMessage(
    original_content_url='https://example.com/image.jpg',
    preview_image_url='https://example.com/preview.jpg'
)
```

### Video Message

```python
from linebot.v3.messaging import VideoMessage

message = VideoMessage(
    original_content_url='https://example.com/video.mp4',
    preview_image_url='https://example.com/preview.jpg'
)
```

### Audio Message

```python
from linebot.v3.messaging import AudioMessage

message = AudioMessage(
    original_content_url='https://example.com/audio.m4a',
    duration=60000  # milliseconds
)
```

### Location Message

```python
from linebot.v3.messaging import LocationMessage

message = LocationMessage(
    title='My Location',
    address='Tokyo, Japan',
    latitude=35.6812,
    longitude=139.7671
)
```

### Sticker Message

```python
from linebot.v3.messaging import StickerMessage

message = StickerMessage(
    package_id='1',
    sticker_id='1'
)
```

### Template Messages

```python
from linebot.v3.messaging import (
    TemplateMessage,
    ButtonsTemplate,
    MessageAction,
    URIAction
)

message = TemplateMessage(
    alt_text='Buttons template',
    template=ButtonsTemplate(
        title='Menu',
        text='Please select',
        actions=[
            MessageAction(label='Say hello', text='Hello!'),
            URIAction(label='Visit website', uri='https://example.com')
        ]
    )
)
```

---

## Webhook Handling Examples

### 1. Handle Different Event Types

```python
from linebot.v3.webhooks import (
    MessageEvent,
    FollowEvent,
    UnfollowEvent,
    JoinEvent,
    LeaveEvent,
    PostbackEvent
)

# Handle message events
@handler.add(MessageEvent, message=TextMessageContent)
def handle_text_message(event):
    # Echo text message
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        line_bot_api.reply_message(
            ReplyMessageRequest(
                reply_token=event.reply_token,
                messages=[TextMessage(text=event.message.text)]
            )
        )

# Handle follow events
@handler.add(FollowEvent)
def handle_follow(event):
    # Send welcome message when user follows
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        line_bot_api.reply_message(
            ReplyMessageRequest(
                reply_token=event.reply_token,
                messages=[TextMessage(text='Thank you for following!')]
            )
        )

# Handle unfollow events
@handler.add(UnfollowEvent)
def handle_unfollow(event):
    # Log unfollow event
    print(f"User {event.source.user_id} unfollowed")

# Handle join events
@handler.add(JoinEvent)
def handle_join(event):
    # Send greeting when bot joins group
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        line_bot_api.reply_message(
            ReplyMessageRequest(
                reply_token=event.reply_token,
                messages=[TextMessage(text='Hello everyone!')]
            )
        )

# Handle postback events
@handler.add(PostbackEvent)
def handle_postback(event):
    # Handle postback data
    postback_data = event.postback.data
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        line_bot_api.reply_message(
            ReplyMessageRequest(
                reply_token=event.reply_token,
                messages=[TextMessage(text=f'Received: {postback_data}')]
            )
        )
```

### 2. Handle Different Message Types

```python
from linebot.v3.webhooks import (
    TextMessageContent,
    ImageMessageContent,
    VideoMessageContent,
    AudioMessageContent,
    LocationMessageContent,
    StickerMessageContent
)

# Handle text messages
@handler.add(MessageEvent, message=TextMessageContent)
def handle_text(event):
    text = event.message.text
    # Process text message
    pass

# Handle image messages
@handler.add(MessageEvent, message=ImageMessageContent)
def handle_image(event):
    message_id = event.message.id
    # Download and process image
    pass

# Handle location messages
@handler.add(MessageEvent, message=LocationMessageContent)
def handle_location(event):
    latitude = event.message.latitude
    longitude = event.message.longitude
    address = event.message.address
    # Process location
    pass

# Handle sticker messages
@handler.add(MessageEvent, message=StickerMessageContent)
def handle_sticker(event):
    package_id = event.message.package_id
    sticker_id = event.message.sticker_id
    # Process sticker
    pass
```

### 3. FastAPI Integration Example

```python
from fastapi import FastAPI, Request, HTTPException
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

app = FastAPI()

configuration = Configuration(access_token='YOUR_CHANNEL_ACCESS_TOKEN')
handler = WebhookHandler('YOUR_CHANNEL_SECRET')

@app.post("/callback")
async def callback(request: Request):
    signature = request.headers['X-Line-Signature']
    body = await request.body()
    body = body.decode('utf-8')

    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    return 'OK'

@handler.add(MessageEvent, message=TextMessageContent)
def handle_message(event):
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        line_bot_api.reply_message(
            ReplyMessageRequest(
                reply_token=event.reply_token,
                messages=[TextMessage(text=event.message.text)]
            )
        )
```

---

## Examples in Repository

SDK 提供了多個範例專案：

1. **aiohttp-echo** - Asynchronous bot implementation
2. **fastapi-echo** - FastAPI framework integration
3. **flask-echo** - Basic Flask implementation
4. **flask-kitchensink** - Feature-rich Flask example with multiple message types
5. **rich-menu** - Rich menu management script
6. **simple-server-echo** - WSGI-based implementation

---

## Version Information

### Current Version: 3.x
- Generated from OpenAPI specifications
- Current and actively maintained
- Full type support

### Previous Version: 2.x
- Still available but no longer maintained
- Shows deprecation warnings
- Users should migrate to 3.x

### Versioning Policy
SDK follows semantic versioning. Note that features becoming unusable due to LINE API changes may be released as patch updates, even though they are technically backward-incompatible.

---

## Migration from 2.x to 3.x

Key differences:
- Import paths changed from `linebot` to `linebot.v3`
- API methods use data classes instead of plain dictionaries
- Better type hints and IDE support
- Improved error handling

Example migration:

**Version 2.x:**
```python
from linebot import LineBotApi, WebhookHandler
line_bot_api = LineBotApi('YOUR_CHANNEL_ACCESS_TOKEN')
```

**Version 3.x:**
```python
from linebot.v3.messaging import Configuration, ApiClient, MessagingApi
configuration = Configuration(access_token='YOUR_CHANNEL_ACCESS_TOKEN')
with ApiClient(configuration) as api_client:
    line_bot_api = MessagingApi(api_client)
```

---

## Official Resources

- **Main Documentation:** https://developers.line.biz/en/docs/messaging-api/overview/
- **API Reference:** https://developers.line.biz/en/reference/messaging-api/
- **FAQ:** https://developers.line.biz/en/faq/
- **News & Updates:** https://developers.line.biz/en/news/
- **GitHub Repository:** https://github.com/line/line-bot-sdk-python

---

## Common Use Cases

### 1. Echo Bot
```python
@handler.add(MessageEvent, message=TextMessageContent)
def echo(event):
    with ApiClient(configuration) as api_client:
        line_bot_api = MessagingApi(api_client)
        line_bot_api.reply_message(
            ReplyMessageRequest(
                reply_token=event.reply_token,
                messages=[TextMessage(text=event.message.text)]
            )
        )
```

### 2. Send Push Message
```python
from linebot.v3.messaging import PushMessageRequest

with ApiClient(configuration) as api_client:
    line_bot_api = MessagingApi(api_client)
    line_bot_api.push_message(
        PushMessageRequest(
            to='USER_ID_OR_GROUP_ID',
            messages=[TextMessage(text='Hello from bot!')]
        )
    )
```

### 3. Multicast Message
```python
from linebot.v3.messaging import MulticastRequest

with ApiClient(configuration) as api_client:
    line_bot_api = MessagingApi(api_client)
    line_bot_api.multicast(
        MulticastRequest(
            to=['USER_ID_1', 'USER_ID_2', 'USER_ID_3'],
            messages=[TextMessage(text='Broadcast message!')]
        )
    )
```

### 4. Get User Profile
```python
with ApiClient(configuration) as api_client:
    line_bot_api = MessagingApi(api_client)
    profile = line_bot_api.get_profile(user_id='USER_ID')
    print(f"Display name: {profile.display_name}")
    print(f"User ID: {profile.user_id}")
    print(f"Picture URL: {profile.picture_url}")
    print(f"Status message: {profile.status_message}")
```

---

## Best Practices

1. **Error Handling**: Always wrap API calls in try-except blocks
2. **Signature Verification**: Never skip signature verification in production
3. **Environment Variables**: Store access tokens and secrets in environment variables
4. **Logging**: Implement proper logging for debugging
5. **Rate Limits**: Be aware of LINE API rate limits
6. **Context Manager**: Use `with ApiClient(configuration)` for proper resource management
7. **Type Hints**: Leverage type hints for better IDE support and code quality

---

## Troubleshooting

### Invalid Signature Error
- Check that channel secret is correct
- Verify that signature header is properly extracted
- Ensure body is passed as string, not bytes

### API Exception
- Check access token is valid and not expired
- Verify channel is properly configured in LINE Developers Console
- Check API rate limits

### Import Errors
- Ensure line-bot-sdk is installed: `pip install line-bot-sdk`
- Verify Python version >= 3.10
- Use `linebot.v3` imports for version 3.x

---

**Note:** This document is for developer reference. Always check the official documentation for the most up-to-date information.
