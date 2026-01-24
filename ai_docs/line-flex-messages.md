# LINE Flex Messages Documentation

**Source:** https://developers.line.biz/en/docs/messaging-api/using-flex-messages/

**Last Updated:** 2025-12-23

## Overview

Flex Messages are messages that offer an extensive and interactive layout compared to ordinary LINE messages. They enable customization based on CSS Flexbox specifications and support left-to-right or right-to-left text direction.

## Architecture

Flex Messages follow a hierarchical composition:

```
Flex Message
└── Container (bubble or carousel)
    └── Blocks (header, hero, body, footer)
        └── Components (box, button, text, image, etc.)
```

- **Top element**: A single container
- **Containers**: Hold message bubbles
- **Bubbles**: Contain blocks
- **Blocks**: Contain components

---

## Container Types

### Bubble Container

A single message bubble container.

**Reference:** `/en/reference/messaging-api/#bubble`

### Carousel Container

Multiple bubbles displayed side-by-side, browsable via horizontal scrolling.

**Reference:** `/en/reference/messaging-api/#f-carousel`

---

## Block Types

Blocks compose bubbles in this order: **header, hero, body, footer**. Each type can only be used once per bubble.

### Header Block
- **Purpose:** Displays message subject
- **Position:** Top of bubble

### Hero Block
- **Purpose:** Shows main image or visual content
- **Position:** Below header

### Body Block
- **Purpose:** Contains primary message content
- **Position:** Below hero

### Footer Block
- **Purpose:** Displays buttons and supplementary information
- **Position:** Bottom of bubble

**Reference:** Bubble properties in Messaging API reference

---

## Component Types

| Component | Function |
|-----------|----------|
| **Box** | Defines horizontal/vertical layout, holds other components |
| **Button** | Renders actionable button (primary, secondary, link styles) |
| **Image** | Displays images with size control |
| **Video** | Renders video with preview image and aspect ratio |
| **Icon** | Decorative icon (baseline box only) |
| **Text** | Text string with color, size, weight, wrapping support |
| **Span** | Multiple styled text strings within text component |
| **Separator** | Horizontal or vertical dividing line |
| **Filler** | ⚠️ Deprecated—use component properties for spacing instead |
| **Spacer** | Creates spacing between components |

---

## Layout System

### Box Layout Types

Three box orientations are available:

#### Horizontal
- Main axis is horizontal
- Children arranged left-to-right

#### Vertical
- Main axis is vertical
- Children arranged top-to-bottom

#### Baseline
- Behaves like horizontal boxes
- Aligns children by text baseline
- Ignores `gravity` property

---

## Spacing & Dimensions

### Spacing Property

**Parent box property**: Minimum space between child components

**Values:**
- Keywords: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`
- Pixels: `10px`, `23.5px`

### Margin Property

**Child component property**: Takes precedence over parent box's spacing

**Values:** Same as spacing (keywords or pixels)

### Padding Properties

Available padding properties:
- `paddingAll` - All sides
- `paddingTop` - Top edge
- `paddingBottom` - Bottom edge
- `paddingStart` - Left edge (LTR) / Right edge (RTL)
- `paddingEnd` - Right edge (LTR) / Left edge (RTL)

**Units:**
- Keywords: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`
- Pixels: `50px`
- Percentage: `50%` (relative to parent width)

---

## Size Units

### Standard Size Keywords

From smallest to largest:
- `xxs`
- `xs`
- `sm`
- `md`
- `lg`
- `xl`
- `xxl`
- `3xl`
- `4xl`
- `5xl`

### Image-Specific
- `full` - Full width

### Other Formats
- **Pixels:** `50px`, `23.5px`
- **Percentage:** `50%` (images only)

---

## Alignment

### Horizontal Alignment (`align`)

Controls horizontal positioning of components:
- `start` - Left aligned (LTR) / Right aligned (RTL)
- `center` - Center aligned (default)
- `end` - Right aligned (LTR) / Left aligned (RTL)

### Vertical Alignment (`gravity`)

Controls vertical positioning of components:
- `top` - Top aligned (default)
- `center` - Center aligned
- `bottom` - Bottom aligned

**Note:** Ignored in baseline boxes

---

## Width & Height

### Width/Height Properties

Specify component dimensions:
- **Pixels:** `100px`
- **Percentage:** `50%` (relative to parent)

### Max Width/Height

`maxWidth` and `maxHeight` take precedence over `width` and `height`:
- Available in LINE iOS 11.22.0+, Android 7.7.0+

### Flex Property

Determines size allocation in flexible layouts:
- `flex: 0` - Content-sized (doesn't grow)
- `flex: 1` or higher - Shares available space proportionally

**Example:**
- Component A: `flex: 1`
- Component B: `flex: 2`
- B gets 2x the space of A

---

## Position & Offset

### Position Property

#### Relative Position
```json
"position": "relative"
```
- Component shifts from original position
- Uses offset properties
- Affects layout flow

#### Absolute Position
```json
"position": "absolute"
```
- Positioned relative to parent edges
- Doesn't affect parent size
- Removed from layout flow

**Constraint:** First child of a block can't be absolute

### Offset Properties

- `offsetTop` - Distance from top
- `offsetBottom` - Distance from bottom
- `offsetStart` - Distance from start edge (left in LTR)
- `offsetEnd` - Distance from end edge (right in LTR)

**Units:**
- Pixels: `10px`
- Keywords: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`
- Percentage: `50%` (relative to parent width/height)

---

## Flex Content Distribution

### Justify Content (`justifyContent`)

Distributes children along main axis:
- `flex-start` - Start of container
- `center` - Center of container
- `flex-end` - End of container
- `space-between` - Even spacing, edges aligned
- `space-around` - Even spacing with half-space at edges
- `space-evenly` - Perfectly even spacing

**Requirement:** All children must have `flex: 0`

### Align Items (`alignItems`)

Distributes children along cross axis:
- `flex-start` - Start of cross axis
- `center` - Center of cross axis
- `flex-end` - End of cross axis

---

## Text Component Features

### Text Wrapping

Prevent truncation with wrapping:
```json
{
  "type": "text",
  "text": "Long text that needs wrapping",
  "wrap": true
}
```

### Line Breaks

Use `\n` character for new lines:
```json
{
  "type": "text",
  "text": "Line 1\nLine 2\nLine 3"
}
```

### Line Spacing

Control spacing between wrapped lines:
```json
{
  "type": "text",
  "text": "Wrapped text",
  "wrap": true,
  "lineSpacing": "lg"
}
```
- Available in LINE iOS 11.22.0+, Android 7.7.0+

### Text Styling

- `color` - Text color (hex format)
- `size` - Text size (keywords or px)
- `weight` - Font weight (`regular`, `bold`)
- `align` - Horizontal alignment
- `gravity` - Vertical alignment

---

## Span Component

Renders multiple text strings with different styles within a single text component:

```json
{
  "type": "text",
  "text": "Default style text",
  "contents": [
    {
      "type": "span",
      "text": "Bold text",
      "weight": "bold"
    },
    {
      "type": "span",
      "text": "Red text",
      "color": "#FF0000"
    }
  ]
}
```

**Supported properties:**
- `color` - Text color
- `size` - Text size
- `weight` - Font weight
- `decoration` - Text decoration (`underline`, `line-through`, `none`)

---

## Icon Component

Decorative icons for baseline boxes:

**Supported sizes:**
- `md`
- `lg`
- `xl`
- `xxl`
- `3xl`

**Note:** Icons only work in baseline layout boxes

---

## Video Component

Renders video content with preview:

**Required properties:**
- `url` - Video URL
- `previewUrl` - Preview image URL
- `altContent` - Alternative content for older LINE versions
- `aspectRatio` - Video aspect ratio

**Supported aspect ratios:**
- `1:1` - Square
- `4:3` - Standard
- `16:9` - Widescreen
- `20:13` - Custom

**Version requirement:** LINE iOS 11.22.0+, Android 7.7.0+

---

## Button Component

Renders actionable buttons:

**Button styles:**
- `primary` - Primary action button
- `secondary` - Secondary action button
- `link` - Text link style

**Scaling property:**
```json
{
  "type": "button",
  "action": {...},
  "scaling": true
}
```
- Available in LINE iOS 13.6.0+, Android 7.17.0+
- Applies to button, text, and icon elements

---

## Action Objects

Components can have action objects for interactivity. Common action types include:

- **URI Action** - Opens URL
- **Message Action** - Sends message when tapped
- **Postback Action** - Sends postback data to webhook
- **Datetime Picker Action** - Opens date/time picker
- **Camera Action** - Opens camera
- **Camera Roll Action** - Opens camera roll
- **Location Action** - Opens location picker

**Reference:** Messaging API action objects documentation

---

## Bubble Size

Bubbles support different sizes:

```json
{
  "type": "bubble",
  "size": "mega"
}
```

**Available sizes:**
- `nano`
- `micro`
- `kilo`
- `mega` - Larger bubble
- `giga` - Largest bubble
- `deca` - Available in newer versions
- `hecto` - Available in newer versions

---

## JSON Structure Example

### Hello World Example

```json
{
  "type": "flex",
  "altText": "Hello, World!",
  "contents": {
    "type": "bubble",
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "Hello,"
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

### Complete Bubble Example

```json
{
  "type": "flex",
  "altText": "Product Information",
  "contents": {
    "type": "bubble",
    "size": "mega",
    "header": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "PRODUCT",
          "weight": "bold",
          "color": "#FFFFFF",
          "size": "sm"
        }
      ],
      "backgroundColor": "#27ACB2",
      "paddingAll": "md"
    },
    "hero": {
      "type": "image",
      "url": "https://example.com/image.jpg",
      "size": "full",
      "aspectRatio": "20:13",
      "aspectMode": "cover"
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "spacing": "md",
      "contents": [
        {
          "type": "text",
          "text": "Product Name",
          "size": "xl",
          "weight": "bold"
        },
        {
          "type": "text",
          "text": "Product description goes here",
          "size": "sm",
          "color": "#999999",
          "wrap": true
        },
        {
          "type": "box",
          "layout": "baseline",
          "spacing": "sm",
          "contents": [
            {
              "type": "text",
              "text": "$100",
              "size": "xl",
              "weight": "bold",
              "color": "#27ACB2"
            },
            {
              "type": "text",
              "text": ".99",
              "size": "sm",
              "color": "#999999"
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
          "action": {
            "type": "uri",
            "label": "Buy Now",
            "uri": "https://example.com/buy"
          }
        },
        {
          "type": "button",
          "style": "secondary",
          "action": {
            "type": "uri",
            "label": "More Info",
            "uri": "https://example.com/info"
          }
        }
      ]
    }
  }
}
```

### Carousel Example

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
      },
      {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Product 3"
            }
          ]
        }
      }
    ]
  }
}
```

---

## Tools & Resources

### Flex Message Simulator

The **Flex Message Simulator** enables testing layouts without actual message delivery.

**Access:** Available in LINE Developers Console

**Features:**
- Visual layout editor
- Live JSON preview
- Component property editing
- Test rendering without sending messages

---

## Version Requirements

### Component Features by Version

| Feature | iOS | Android | Desktop |
|---------|-----|---------|---------|
| Video component | 11.22.0+ | 7.7.0+ | - |
| maxWidth/maxHeight | 11.22.0+ | 7.7.0+ | - |
| lineSpacing | 11.22.0+ | 7.7.0+ | - |
| Scaling property | 13.6.0+ | 7.17.0+ | - |
| Bubble sizes (deca, hecto) | 13.6.0+ | 7.17.0+ | - |

### Backward Compatibility

- Older LINE versions that don't support certain features will fall back to alternative rendering
- Video components require `altContent` property for older versions
- Always test on multiple LINE versions if using newer features

---

## Best Practices

### Design Guidelines

1. **Keep it simple** - Don't overcomplicate layouts
2. **Test on devices** - Use Flex Message Simulator
3. **Provide alt text** - Always include meaningful `altText` for notifications
4. **Mobile-first** - Design for small screens
5. **Accessibility** - Use readable font sizes and color contrasts

### Performance Tips

1. **Optimize images** - Use appropriate image sizes
2. **Minimize nesting** - Avoid too many nested boxes
3. **Reuse components** - Create reusable templates
4. **Test loading** - Ensure fast message rendering

### Common Patterns

1. **Product cards** - Hero image + details + CTA buttons
2. **Event tickets** - Header with event name + body with details + footer with action
3. **Receipts** - Header with logo + body with items + footer with total
4. **Notifications** - Simple text with icon + action button

---

## Additional References

- **Flex Message Elements:** https://developers.line.biz/en/docs/messaging-api/flex-message-elements/
- **Flex Message Layout:** https://developers.line.biz/en/docs/messaging-api/flex-message-layout/
- **Messaging API Reference:** https://developers.line.biz/en/reference/messaging-api/
- **Flex Message Simulator:** Available in LINE Developers Console

---

## Notes

- Flex Messages are based on CSS Flexbox specifications
- Support both left-to-right (LTR) and right-to-left (RTL) text direction
- Maximum of 13 bubbles in a carousel
- Bubble size affects the overall message dimensions
- All color values use hexadecimal format (e.g., `#FFFFFF`, `#FF0000`)
