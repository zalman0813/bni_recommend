# LINE Messaging API - Message Types Reference

**Source:** https://developers.line.biz/en/docs/messaging-api/message-types/

**API Reference:** https://developers.line.biz/en/reference/messaging-api/

**Last Updated:** 2025-12-23

---

## Overview

The LINE Messaging API supports multiple message types that can be sent to users. You can send up to 5 message objects in a single API request. All messages are sent in JSON format over HTTPS (TLS 1.2 or later).

---

## Message Types

### 1. Text Message

Text messages contain text, including emojis and Unicode characters.

#### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"text"` |
| `text` | String | Yes | Message text (max: 5,000 characters) |
| `emojis` | Array | No | Array of LINE emoji objects |
| `quoteToken` | String | No | Quote token to quote this message |

#### JSON Example

```json
{
  "type": "text",
  "text": "Hello, World!"
}
```

#### With LINE Emojis

```json
{
  "type": "text",
  "text": "$ LINE emoji $",
  "emojis": [
    {
      "index": 0,
      "productId": "5ac1bfd5040ab15980c9b435",
      "emojiId": "001"
    }
  ]
}
```

---

### 2. Text Message (v2)

Enhanced version of text message that allows string substitution within `{` and `}` brackets for mentions and emojis.

#### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"text"` |
| `text` | String | Yes | Message text with substitution placeholders |
| `substitution` | Object | No | Substitution object for mentions/emojis |

#### JSON Example

```json
{
  "type": "text",
  "text": "Hello {user}, check this {emoji}",
  "substitution": {
    "user": {
      "type": "mention",
      "mentionee": {
        "type": "user",
        "userId": "U1234567890abcdef1234567890abcdef"
      }
    },
    "emoji": {
      "type": "emoji",
      "productId": "5ac1bfd5040ab15980c9b435",
      "emojiId": "001"
    }
  }
}
```

---

### 3. Image Message

Image messages display an image with a preview thumbnail.

#### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"image"` |
| `originalContentUrl` | String | Yes | HTTPS URL of the original image (max: 10 MB, JPG/PNG) |
| `previewImageUrl` | String | Yes | HTTPS URL of the preview image (max: 1 MB, JPG/PNG) |

#### Constraints

- Format: JPG or PNG only
- Max file size: 10 MB (original), 1 MB (preview)
- Max dimensions: 10,240 × 10,240 pixels
- HTTPS required (TLS 1.2+)

#### JSON Example

```json
{
  "type": "image",
  "originalContentUrl": "https://example.com/images/original.jpg",
  "previewImageUrl": "https://example.com/images/preview.jpg"
}
```

---

### 4. Video Message

Video messages display a preview image that plays the video when tapped.

#### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"video"` |
| `originalContentUrl` | String | Yes | HTTPS URL of the video file (max: 200 MB, MP4) |
| `previewImageUrl` | String | Yes | HTTPS URL of the preview image (max: 1 MB, JPG/PNG) |
| `trackingId` | String | No | ID to identify the video when the video viewing complete event occurs |

#### Constraints

- Format: MP4 only
- Max file size: 200 MB
- Max duration: No limit
- HTTPS required (TLS 1.2+)

#### JSON Example

```json
{
  "type": "video",
  "originalContentUrl": "https://example.com/videos/video.mp4",
  "previewImageUrl": "https://example.com/videos/preview.jpg",
  "trackingId": "track-001"
}
```

---

### 5. Audio Message

Audio messages contain an audio file URL and its duration.

#### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"audio"` |
| `originalContentUrl` | String | Yes | HTTPS URL of the audio file (max: 200 MB, M4A) |
| `duration` | Number | Yes | Length of audio file in milliseconds |

#### Constraints

- Format: M4A only
- Max file size: 200 MB
- Max duration: 1 hour
- HTTPS required (TLS 1.2+)

#### JSON Example

```json
{
  "type": "audio",
  "originalContentUrl": "https://example.com/audio/sample.m4a",
  "duration": 60000
}
```

---

### 6. Location Message

Location messages share geographic coordinates with a title and address.

#### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"location"` |
| `title` | String | Yes | Title of the location (max: 100 characters) |
| `address` | String | Yes | Address (max: 100 characters) |
| `latitude` | Number | Yes | Latitude (decimal) |
| `longitude` | Number | Yes | Longitude (decimal) |

#### JSON Example

```json
{
  "type": "location",
  "title": "LINE Corporation",
  "address": "1-6-1 Yotsuya, Shinjuku-ku, Tokyo, 160-0004, Japan",
  "latitude": 35.687574,
  "longitude": 139.72922
}
```

---

### 7. Sticker Message

Sticker messages send LINE stickers to make conversations more expressive.

#### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"sticker"` |
| `packageId` | String | Yes | Package ID of the sticker |
| `stickerId` | String | Yes | Sticker ID |

#### JSON Example

```json
{
  "type": "sticker",
  "packageId": "446",
  "stickerId": "1988"
}
```

**Note:** You can find sticker package IDs and sticker IDs in the [sticker list](https://developers.line.biz/en/docs/messaging-api/sticker-list/).

---

### 8. Coupon Message

Coupon messages deliver promotional coupons to users.

#### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"coupon"` |
| `couponCode` | String | Yes | Coupon code |

#### JSON Example

```json
{
  "type": "coupon",
  "couponCode": "SUMMER2025"
}
```

---

### 9. Imagemap Message

Imagemap messages are images with multiple tappable areas that can trigger different actions.

#### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"imagemap"` |
| `baseUrl` | String | Yes | Base URL of the image (HTTPS) |
| `altText` | String | Yes | Alternative text (max: 400 characters) |
| `baseSize` | Object | Yes | Width and height of base image in pixels |
| `video` | Object | No | Video object to play on imagemap |
| `actions` | Array | Yes | Array of action objects (max: 50) |

#### JSON Example

```json
{
  "type": "imagemap",
  "baseUrl": "https://example.com/images/imagemap",
  "altText": "This is an imagemap",
  "baseSize": {
    "width": 1040,
    "height": 1040
  },
  "actions": [
    {
      "type": "uri",
      "linkUri": "https://example.com/page1",
      "area": {
        "x": 0,
        "y": 0,
        "width": 520,
        "height": 520
      }
    },
    {
      "type": "message",
      "text": "Clicked area 2",
      "area": {
        "x": 520,
        "y": 0,
        "width": 520,
        "height": 520
      }
    }
  ]
}
```

#### Action Types

- `uri`: Opens a web page
- `message`: Sends a message on behalf of the user

---

### 10. Template Message

Template messages use predefined layouts for richer interactions.

#### Common Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"template"` |
| `altText` | String | Yes | Alternative text (max: 400 characters) |
| `template` | Object | Yes | Template object |

---

#### 10.1 Buttons Template

A template with an image, text, and multiple action buttons.

##### Template Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"buttons"` |
| `thumbnailImageUrl` | String | No | Image URL (HTTPS, JPG/PNG, max: 1 MB) |
| `imageAspectRatio` | String | No | Aspect ratio: `rectangle` (default) or `square` |
| `imageSize` | String | No | Size: `cover` (default) or `contain` |
| `imageBackgroundColor` | String | No | Background color in hex (e.g., `#FFFFFF`) |
| `title` | String | No | Title text (max: 40 characters) |
| `text` | String | Yes | Message text (max: 160 characters) |
| `defaultAction` | Object | No | Default action when tapping the image or title |
| `actions` | Array | Yes | Array of action objects (max: 4) |

##### JSON Example

```json
{
  "type": "template",
  "altText": "This is a buttons template",
  "template": {
    "type": "buttons",
    "thumbnailImageUrl": "https://example.com/image.jpg",
    "imageAspectRatio": "rectangle",
    "imageSize": "cover",
    "imageBackgroundColor": "#FFFFFF",
    "title": "Menu",
    "text": "Please select an option",
    "actions": [
      {
        "type": "postback",
        "label": "Buy",
        "data": "action=buy&itemid=123"
      },
      {
        "type": "uri",
        "label": "View Website",
        "uri": "https://example.com"
      },
      {
        "type": "message",
        "label": "Say Hello",
        "text": "Hello!"
      }
    ]
  }
}
```

---

#### 10.2 Confirm Template

A template with two action buttons for yes/no or confirm/cancel scenarios.

##### Template Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"confirm"` |
| `text` | String | Yes | Message text (max: 240 characters) |
| `actions` | Array | Yes | Array of 2 action objects |

##### JSON Example

```json
{
  "type": "template",
  "altText": "This is a confirm template",
  "template": {
    "type": "confirm",
    "text": "Are you sure you want to proceed?",
    "actions": [
      {
        "type": "message",
        "label": "Yes",
        "text": "Yes, proceed"
      },
      {
        "type": "message",
        "label": "No",
        "text": "No, cancel"
      }
    ]
  }
}
```

---

#### 10.3 Carousel Template

A template with multiple columns that users can scroll through horizontally.

##### Template Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"carousel"` |
| `columns` | Array | Yes | Array of column objects (max: 10) |
| `imageAspectRatio` | String | No | Aspect ratio: `rectangle` (default) or `square` |
| `imageSize` | String | No | Size: `cover` (default) or `contain` |

##### Column Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `thumbnailImageUrl` | String | No | Image URL (HTTPS, JPG/PNG) |
| `imageBackgroundColor` | String | No | Background color in hex |
| `title` | String | No | Title (max: 40 characters) |
| `text` | String | Yes | Text (max: 120 characters with image, 160 without) |
| `defaultAction` | Object | No | Default action when tapping the image or title |
| `actions` | Array | Yes | Array of action objects (max: 3) |

##### JSON Example

```json
{
  "type": "template",
  "altText": "This is a carousel template",
  "template": {
    "type": "carousel",
    "columns": [
      {
        "thumbnailImageUrl": "https://example.com/item1.jpg",
        "title": "Product 1",
        "text": "Description of product 1",
        "actions": [
          {
            "type": "postback",
            "label": "Buy",
            "data": "action=buy&itemid=1"
          },
          {
            "type": "uri",
            "label": "View",
            "uri": "https://example.com/product/1"
          }
        ]
      },
      {
        "thumbnailImageUrl": "https://example.com/item2.jpg",
        "title": "Product 2",
        "text": "Description of product 2",
        "actions": [
          {
            "type": "postback",
            "label": "Buy",
            "data": "action=buy&itemid=2"
          },
          {
            "type": "uri",
            "label": "View",
            "uri": "https://example.com/product/2"
          }
        ]
      }
    ],
    "imageAspectRatio": "rectangle",
    "imageSize": "cover"
  }
}
```

---

#### 10.4 Image Carousel Template

A carousel template with only images and actions.

##### Template Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"image_carousel"` |
| `columns` | Array | Yes | Array of column objects (max: 10) |

##### Column Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `imageUrl` | String | Yes | Image URL (HTTPS, JPG/PNG) |
| `action` | Object | Yes | Action object |

##### JSON Example

```json
{
  "type": "template",
  "altText": "This is an image carousel template",
  "template": {
    "type": "image_carousel",
    "columns": [
      {
        "imageUrl": "https://example.com/image1.jpg",
        "action": {
          "type": "uri",
          "label": "View 1",
          "uri": "https://example.com/page1"
        }
      },
      {
        "imageUrl": "https://example.com/image2.jpg",
        "action": {
          "type": "postback",
          "label": "Select 2",
          "data": "action=select&id=2"
        }
      }
    ]
  }
}
```

---

### 11. Flex Message

Flex Messages provide customizable layouts using CSS Flexbox-like structure.

#### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"flex"` |
| `altText` | String | Yes | Alternative text (max: 400 characters) |
| `contents` | Object | Yes | Flex container object (`bubble` or `carousel`) |

#### Container Types

- **Bubble**: Contains a single message bubble
- **Carousel**: Contains multiple bubbles for horizontal scrolling

---

#### Bubble Container Structure

A bubble consists of these blocks (all optional except at least one block is required):

- `header`: Header block
- `hero`: Hero image block
- `body`: Body block (main content)
- `footer`: Footer block

#### JSON Example - Simple Bubble

```json
{
  "type": "flex",
  "altText": "This is a Flex Message",
  "contents": {
    "type": "bubble",
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "Hello,",
          "weight": "bold",
          "size": "xl"
        },
        {
          "type": "text",
          "text": "World!"
        }
      ]
    }
  }
}
```

#### JSON Example - Complete Bubble

```json
{
  "type": "flex",
  "altText": "Restaurant Info",
  "contents": {
    "type": "bubble",
    "hero": {
      "type": "image",
      "url": "https://example.com/restaurant.jpg",
      "size": "full",
      "aspectRatio": "20:13",
      "aspectMode": "cover"
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "Brown's Burger",
          "weight": "bold",
          "size": "xl"
        },
        {
          "type": "box",
          "layout": "baseline",
          "margin": "md",
          "contents": [
            {
              "type": "icon",
              "size": "sm",
              "url": "https://example.com/star.png"
            },
            {
              "type": "text",
              "text": "4.5",
              "size": "sm",
              "color": "#999999",
              "margin": "md",
              "flex": 0
            }
          ]
        },
        {
          "type": "box",
          "layout": "vertical",
          "margin": "lg",
          "spacing": "sm",
          "contents": [
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "Place",
                  "color": "#aaaaaa",
                  "size": "sm",
                  "flex": 1
                },
                {
                  "type": "text",
                  "text": "Tokyo",
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 5
                }
              ]
            }
          ]
        }
      ]
    },
    "footer": {
      "type": "box",
      "layout": "vertical",
      "spacing": "sm",
      "contents": [
        {
          "type": "button",
          "style": "primary",
          "height": "sm",
          "action": {
            "type": "uri",
            "label": "CALL",
            "uri": "tel:0312345678"
          }
        },
        {
          "type": "button",
          "style": "link",
          "height": "sm",
          "action": {
            "type": "uri",
            "label": "WEBSITE",
            "uri": "https://example.com"
          }
        }
      ],
      "flex": 0
    }
  }
}
```

#### Carousel Container Example

```json
{
  "type": "flex",
  "altText": "Product Carousel",
  "contents": {
    "type": "carousel",
    "contents": [
      {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Product 1"
            }
          ]
        }
      },
      {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Product 2"
            }
          ]
        }
      }
    ]
  }
}
```

#### Flex Message Components

Common components you can use in Flex Messages:

- **box**: Container for other components
- **text**: Text element
- **button**: Button with action
- **image**: Image element
- **icon**: Small icon image
- **separator**: Separator line
- **spacer**: Empty space
- **filler**: Fills remaining space

**Note:** For detailed Flex Message component specifications, see [Flex Message elements](https://developers.line.biz/en/docs/messaging-api/flex-message-elements/).

---

## Action Objects

Actions define what happens when users interact with messages.

### Action Types

#### 1. Postback Action

Sends a postback event to the webhook.

```json
{
  "type": "postback",
  "label": "Buy Now",
  "data": "action=buy&itemid=123",
  "displayText": "Buying item 123",
  "inputOption": "openKeyboard",
  "fillInText": "Enter quantity"
}
```

**Properties:**
- `label` (String, required): Label text (max: 20 characters)
- `data` (String, required): Postback data (max: 300 characters)
- `displayText` (String, optional): Text displayed in chat when tapped
- `inputOption` (String, optional): `closeRichMenu`, `openRichMenu`, `openKeyboard`, `openVoice`
- `fillInText` (String, optional): String to insert into message input field

#### 2. Message Action

Sends a message on behalf of the user.

```json
{
  "type": "message",
  "label": "Yes",
  "text": "I confirm this action"
}
```

**Properties:**
- `label` (String, required): Label text (max: 20 characters)
- `text` (String, required): Message text (max: 300 characters)

#### 3. URI Action

Opens a web page or triggers an app action.

```json
{
  "type": "uri",
  "label": "View Website",
  "uri": "https://example.com",
  "altUri": {
    "desktop": "https://example.com/desktop"
  }
}
```

**Properties:**
- `label` (String, required): Label text (max: 20 characters)
- `uri` (String, required): URI to open
- `altUri` (Object, optional): Alternative URIs for different devices

**Supported URI schemes:**
- `https://` - Web pages
- `tel://` - Phone calls
- `line://` - LINE app features

#### 4. Datetime Picker Action

Opens a datetime picker.

```json
{
  "type": "datetimepicker",
  "label": "Select date",
  "data": "action=selectdate",
  "mode": "datetime",
  "initial": "2025-12-23T10:00",
  "max": "2025-12-31T23:59",
  "min": "2025-12-01T00:00"
}
```

**Properties:**
- `mode` (String, required): `date`, `time`, or `datetime`
- `initial` (String, optional): Initial value
- `max` (String, optional): Maximum value
- `min` (String, optional): Minimum value

#### 5. Camera Action

Opens the camera.

```json
{
  "type": "camera",
  "label": "Take Photo"
}
```

#### 6. Camera Roll Action

Opens the camera roll.

```json
{
  "type": "cameraRoll",
  "label": "Select Photo"
}
```

#### 7. Location Action

Opens location screen.

```json
{
  "type": "location",
  "label": "Send Location"
}
```

---

## Quick Reply

Quick reply buttons can be added to any message type and appear at the bottom of the chat.

### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `items` | Array | Yes | Array of quick reply button objects (max: 13) |

### Quick Reply Button Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | String | Yes | Must be `"action"` |
| `imageUrl` | String | No | Icon image URL (HTTPS, PNG, max: 1 MB) |
| `action` | Object | Yes | Action object (any action type) |

### JSON Example

```json
{
  "type": "text",
  "text": "Select an option:",
  "quickReply": {
    "items": [
      {
        "type": "action",
        "imageUrl": "https://example.com/icon1.png",
        "action": {
          "type": "message",
          "label": "Option 1",
          "text": "Selected option 1"
        }
      },
      {
        "type": "action",
        "action": {
          "type": "postback",
          "label": "Option 2",
          "data": "action=select&option=2",
          "displayText": "Selected option 2"
        }
      },
      {
        "type": "action",
        "action": {
          "type": "location",
          "label": "Send Location"
        }
      }
    ]
  }
}
```

---

## Sending Messages

### Push Message API

Send messages to users at any time.

**Endpoint:** `POST https://api.line.me/v2/bot/message/push`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer {CHANNEL_ACCESS_TOKEN}`

**Request Body:**

```json
{
  "to": "U1234567890abcdef1234567890abcdef",
  "messages": [
    {
      "type": "text",
      "text": "Hello, World!"
    },
    {
      "type": "sticker",
      "packageId": "446",
      "stickerId": "1988"
    }
  ]
}
```

**Note:** You can send up to 5 message objects in the `messages` array.

---

### Reply Message API

Reply to events received from the webhook.

**Endpoint:** `POST https://api.line.me/v2/bot/message/reply`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer {CHANNEL_ACCESS_TOKEN}`

**Request Body:**

```json
{
  "replyToken": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "messages": [
    {
      "type": "text",
      "text": "Thank you for your message!"
    }
  ]
}
```

**Note:**
- Reply tokens are valid for 60 seconds
- Can only be used once
- Can send up to 5 message objects

---

### Multicast Message API

Send messages to multiple users at once.

**Endpoint:** `POST https://api.line.me/v2/bot/message/multicast`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer {CHANNEL_ACCESS_TOKEN}`

**Request Body:**

```json
{
  "to": [
    "U1234567890abcdef1234567890abcdef",
    "U0987654321fedcba0987654321fedcba"
  ],
  "messages": [
    {
      "type": "text",
      "text": "Hello everyone!"
    }
  ]
}
```

**Note:**
- Can send to up to 500 users per request
- Can send up to 5 message objects

---

### Broadcast Message API

Send messages to all users who have added your bot as a friend.

**Endpoint:** `POST https://api.line.me/v2/bot/message/broadcast`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer {CHANNEL_ACCESS_TOKEN}`

**Request Body:**

```json
{
  "messages": [
    {
      "type": "text",
      "text": "Important announcement!"
    }
  ]
}
```

---

## Best Practices

### General Guidelines

1. **Use appropriate message types**: Choose the message type that best fits your content
2. **Keep it concise**: Users prefer short, scannable messages
3. **Use rich content**: Images, videos, and Flex Messages increase engagement
4. **Test on different devices**: Ensure messages display correctly on various screen sizes
5. **Provide alt text**: Always include `altText` for template and Flex Messages

### Performance

1. **Optimize image sizes**: Use appropriate resolution and compression
2. **Use CDN**: Host media files on a reliable CDN with HTTPS support
3. **Cache resources**: Reduce loading times by caching images and videos
4. **Lazy load**: Consider loading heavy content only when needed

### User Experience

1. **Use Quick Replies**: Make interactions easier with quick reply buttons
2. **Provide clear CTAs**: Use clear labels for actions
3. **Handle errors gracefully**: Provide fallback content when media fails to load
4. **Respect user preferences**: Don't send too many messages

### Security

1. **Always use HTTPS**: All media URLs must use HTTPS (TLS 1.2+)
2. **Validate URLs**: Ensure all URLs are valid and accessible
3. **Protect user data**: Don't expose sensitive information in postback data
4. **Use secure tokens**: Keep channel access tokens secure

---

## Common Errors

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Invalid request | Check JSON syntax and required fields |
| 401 | Invalid channel access token | Verify your access token |
| 403 | Forbidden | Check API permissions |
| 404 | Not found | Verify endpoint URL |
| 429 | Rate limit exceeded | Reduce request frequency |
| 500 | Internal server error | Retry after some time |

### Common Issues

1. **Image not displaying**
   - Ensure URL uses HTTPS
   - Check image format (JPG/PNG only)
   - Verify file size is within limits
   - Ensure URL is publicly accessible

2. **Video not playing**
   - Verify MP4 format
   - Check file size (max 200 MB)
   - Ensure preview image is accessible

3. **Template not rendering**
   - Verify all required fields are present
   - Check action array length (max 4 for buttons, 3 for carousel)
   - Ensure text length is within limits

4. **Flex Message not displaying**
   - Validate JSON structure
   - Check component nesting levels
   - Ensure all required properties are set
   - Use [Flex Message Simulator](https://developers.line.biz/flex-simulator/) for testing

---

## Additional Resources

- **Official Documentation:** https://developers.line.biz/en/docs/messaging-api/
- **API Reference:** https://developers.line.biz/en/reference/messaging-api/
- **Flex Message Simulator:** https://developers.line.biz/flex-simulator/
- **Sticker List:** https://developers.line.biz/en/docs/messaging-api/sticker-list/
- **LINE Developers Console:** https://developers.line.biz/console/

---

## Version History

- **2025-12-23**: Initial documentation created
- Text message v2 now recommended for new features
- All message types support quick reply
- Maximum 5 messages per API request

---

*This document is for developer reference. For the most up-to-date information, always refer to the official LINE Developers documentation.*
