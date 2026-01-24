#!/bin/bash

# Set Default Rich Menu Script
# Usage: ./scripts/set-default-richmenu.sh [menu_id]
# If no menu_id provided, uses RICH_MENU_UNBOUND_ID from .env

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

API_BASE="https://api.line.me/v2/bot"

# Get menu ID from argument or .env
MENU_ID="${1:-$RICH_MENU_UNBOUND_ID}"

if [ -z "$MENU_ID" ]; then
    echo "Error: No Rich Menu ID provided"
    echo ""
    echo "Usage: ./scripts/set-default-richmenu.sh [menu_id]"
    echo "  Or set RICH_MENU_UNBOUND_ID in .env"
    exit 1
fi

echo "=== Set Default Rich Menu ==="
echo ""
echo "Menu ID: $MENU_ID"
echo ""

# Check current default
echo "Current default:"
current=$(curl -s -X GET "$API_BASE/user/all/richmenu" \
    -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN")
echo "  $current"
echo ""

# Set new default
echo "Setting default..."
response=$(curl -s -X POST "$API_BASE/user/all/richmenu/$MENU_ID" \
    -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN" \
    -H "Content-Length: 0")

if [ -n "$response" ] && echo "$response" | grep -q "message"; then
    echo "  Error: $response"
    exit 1
fi

echo "  Success!"
echo ""

# Verify
echo "Verification:"
verify=$(curl -s -X GET "$API_BASE/user/all/richmenu" \
    -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN")
echo "  $verify"
echo ""
echo "Done. New users will now see this Rich Menu."
