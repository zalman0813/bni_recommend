#!/bin/bash

# Delete all Rich Menus Script
# Usage: ./scripts/delete-richmenu.sh

set -e

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

echo "=== Delete All Rich Menus ==="
echo ""

# Get all rich menus
response=$(curl -s -X GET "$API_BASE/list" \
    -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN")

# Extract rich menu IDs
menu_ids=$(echo "$response" | grep -o '"richMenuId":"[^"]*"' | cut -d'"' -f4)

if [ -z "$menu_ids" ]; then
    echo "No rich menus found."
    exit 0
fi

# Delete each menu
for menu_id in $menu_ids; do
    echo "Deleting: $menu_id"
    curl -s -X DELETE "$API_BASE/$menu_id" \
        -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN" > /dev/null
    echo "  Deleted"
done

echo ""
echo "All rich menus deleted."
