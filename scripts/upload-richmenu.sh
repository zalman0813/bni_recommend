#!/bin/bash

# BNI Rich Menu Upload Script
# Usage: ./scripts/upload-richmenu.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load .env file
if [ -f "$PROJECT_DIR/.env" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
else
    echo "Error: .env file not found"
    echo "Please copy .env.example to .env and fill in your credentials"
    exit 1
fi

# Check required variables
if [ -z "$LINE_CHANNEL_ACCESS_TOKEN" ] || [ "$LINE_CHANNEL_ACCESS_TOKEN" = "your_channel_access_token_here" ]; then
    echo "Error: LINE_CHANNEL_ACCESS_TOKEN is not set in .env"
    exit 1
fi

API_BASE="https://api.line.me/v2/bot/richmenu"
DATA_API_BASE="https://api-data.line.me/v2/bot/richmenu"

# Image paths (processed JPG files with correct dimensions)
IMG_UNBOUND="$PROJECT_DIR/images/richmenu_unbound.jpg"
IMG_MEMBER="$PROJECT_DIR/images/richmenu_member.jpg"
IMG_LEADER="$PROJECT_DIR/images/richmenu_leader.jpg"

echo "=== BNI Rich Menu Upload Script ==="
echo ""

# Function to create rich menu
create_richmenu() {
    local name=$1
    local json=$2

    echo "Creating Rich Menu: $name..."

    response=$(curl -s -X POST "$API_BASE" \
        -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$json")

    rich_menu_id=$(echo "$response" | grep -o '"richMenuId":"[^"]*"' | cut -d'"' -f4)

    if [ -z "$rich_menu_id" ]; then
        echo "Error creating $name: $response"
        exit 1
    fi

    echo "  Created: $rich_menu_id"
    echo "$rich_menu_id"
}

# Function to upload image
upload_image() {
    local menu_id=$1
    local image_path=$2
    local name=$3

    echo "Uploading image for $name..."

    response=$(curl -s -X POST "$DATA_API_BASE/$menu_id/content" \
        -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN" \
        -H "Content-Type: image/jpeg" \
        --data-binary "@$image_path")

    if [ -n "$response" ] && echo "$response" | grep -q "error"; then
        echo "Error uploading image for $name: $response"
        exit 1
    fi

    echo "  Uploaded successfully"
}

# Rich Menu JSON definitions
JSON_UNBOUND='{
  "size": { "width": 2500, "height": 843 },
  "selected": true,
  "name": "Menu_Unbound",
  "chatBarText": "點擊開始",
  "areas": [
    {
      "bounds": { "x": 0, "y": 0, "width": 2500, "height": 843 },
      "action": {
        "type": "postback",
        "data": "action=start_binding",
        "displayText": "啟動姓名綁定"
      }
    }
  ]
}'

JSON_MEMBER='{
  "size": { "width": 2500, "height": 843 },
  "selected": true,
  "name": "Menu_Member",
  "chatBarText": "選單",
  "areas": [
    {
      "bounds": { "x": 0, "y": 0, "width": 1250, "height": 843 },
      "action": {
        "type": "postback",
        "data": "action=start_report",
        "displayText": "我要回報"
      }
    },
    {
      "bounds": { "x": 1250, "y": 0, "width": 1250, "height": 843 },
      "action": {
        "type": "postback",
        "data": "action=view_my_summary",
        "displayText": "查看本週數據"
      }
    }
  ]
}'

JSON_LEADER='{
  "size": { "width": 2500, "height": 1686 },
  "selected": true,
  "name": "Menu_Leader",
  "chatBarText": "組長選單",
  "areas": [
    {
      "bounds": { "x": 0, "y": 0, "width": 1250, "height": 843 },
      "action": {
        "type": "postback",
        "data": "action=start_report",
        "displayText": "我要回報"
      }
    },
    {
      "bounds": { "x": 1250, "y": 0, "width": 1250, "height": 843 },
      "action": {
        "type": "postback",
        "data": "action=view_my_summary",
        "displayText": "查看本週數據"
      }
    },
    {
      "bounds": { "x": 0, "y": 843, "width": 833, "height": 843 },
      "action": {
        "type": "postback",
        "data": "action=view_reported_list",
        "displayText": "本週已回報"
      }
    },
    {
      "bounds": { "x": 833, "y": 843, "width": 833, "height": 843 },
      "action": {
        "type": "postback",
        "data": "action=view_not_reported",
        "displayText": "本週未回報"
      }
    },
    {
      "bounds": { "x": 1666, "y": 843, "width": 834, "height": 843 },
      "action": {
        "type": "postback",
        "data": "action=open_sheet",
        "displayText": "雲端總覽"
      }
    }
  ]
}'

# Check if images exist
for img in "$IMG_UNBOUND" "$IMG_MEMBER" "$IMG_LEADER"; do
    if [ ! -f "$img" ]; then
        echo "Error: Image not found: $img"
        exit 1
    fi
done

echo "All images found. Starting upload..."
echo ""

# Create rich menus and capture IDs
UNBOUND_ID=$(create_richmenu "Unbound" "$JSON_UNBOUND" | tail -1)
MEMBER_ID=$(create_richmenu "Member" "$JSON_MEMBER" | tail -1)
LEADER_ID=$(create_richmenu "Leader" "$JSON_LEADER" | tail -1)

echo ""

# Upload images
upload_image "$UNBOUND_ID" "$IMG_UNBOUND" "Unbound"
upload_image "$MEMBER_ID" "$IMG_MEMBER" "Member"
upload_image "$LEADER_ID" "$IMG_LEADER" "Leader"

echo ""

# Set unbound as default
echo "Setting Unbound menu as default..."
response=$(curl -s -X POST "https://api.line.me/v2/bot/user/all/richmenu/$UNBOUND_ID" \
    -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN" \
    -H "Content-Length: 0")

if [ -n "$response" ] && echo "$response" | grep -q "message"; then
    echo "  Error setting default: $response"
    exit 1
fi
echo "  Done (default set successfully)"

echo ""
echo "=== Upload Complete ==="
echo ""
echo "Rich Menu IDs (add these to .env and GAS Script Properties):"
echo ""
echo "RICH_MENU_UNBOUND_ID=$UNBOUND_ID"
echo "RICH_MENU_MEMBER_ID=$MEMBER_ID"
echo "RICH_MENU_LEADER_ID=$LEADER_ID"
echo ""

# Update .env file with new IDs
if grep -q "RICH_MENU_UNBOUND_ID=" "$PROJECT_DIR/.env"; then
    # Update existing entries
    sed -i '' "s/RICH_MENU_UNBOUND_ID=.*/RICH_MENU_UNBOUND_ID=$UNBOUND_ID/" "$PROJECT_DIR/.env"
    sed -i '' "s/RICH_MENU_MEMBER_ID=.*/RICH_MENU_MEMBER_ID=$MEMBER_ID/" "$PROJECT_DIR/.env"
    sed -i '' "s/RICH_MENU_LEADER_ID=.*/RICH_MENU_LEADER_ID=$LEADER_ID/" "$PROJECT_DIR/.env"
    echo ".env file updated with new Rich Menu IDs"
else
    # Append new entries
    echo "" >> "$PROJECT_DIR/.env"
    echo "RICH_MENU_UNBOUND_ID=$UNBOUND_ID" >> "$PROJECT_DIR/.env"
    echo "RICH_MENU_MEMBER_ID=$MEMBER_ID" >> "$PROJECT_DIR/.env"
    echo "RICH_MENU_LEADER_ID=$LEADER_ID" >> "$PROJECT_DIR/.env"
    echo "Rich Menu IDs appended to .env file"
fi
