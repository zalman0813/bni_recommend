#!/bin/bash

# List all Rich Menus Script
# Usage: ./scripts/list-richmenu.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load .env file
if [ -f "$PROJECT_DIR/.env" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

if [ -z "$LINE_CHANNEL_ACCESS_TOKEN" ] || [ "$LINE_CHANNEL_ACCESS_TOKEN" = "your_channel_access_token_here" ]; then
    echo "Error: LINE_CHANNEL_ACCESS_TOKEN is not set in .env"
    exit 1
fi

API_BASE="https://api.line.me/v2/bot/richmenu"

echo "=== Current Rich Menus ==="
echo ""

# Get all rich menus
curl -s -X GET "$API_BASE/list" \
    -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN" | python3 -m json.tool 2>/dev/null || \
curl -s -X GET "$API_BASE/list" \
    -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN"

echo ""
