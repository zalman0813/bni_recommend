# Issue 001: Detailed Error Messages for Debugging

## Status: Pending

## Background

In the debug log cleanup (2025-01), error messages shown to users were simplified for better UX:

### Changes Made

| Location | Before | After |
|----------|--------|-------|
| `StateMachine.gs` handleBindingState | `[DEBUG] 錯誤：${error.message}` | `綁定過程發生錯誤，請稍後再試。` |
| `StateMachine.gs` handleQ6 | `系統錯誤：${error.message}\n請稍後再試。` | `系統錯誤，請稍後再試。` |

## Issue

When errors occur, users now see generic messages instead of detailed error info. This improves UX but makes debugging harder.

## Proposed Solution

Add a debug mode toggle that can be enabled for specific users or globally:

1. Add `DEBUG_MODE` flag in Config.gs
2. When enabled, show detailed error messages to users
3. Consider adding admin-only debug mode

## How to Enable (Future Implementation)

```javascript
// In Config.gs
const DEBUG_MODE = false; // Set to true for debugging

// In error handlers
const errorMsg = DEBUG_MODE
  ? `錯誤：${error.message}`
  : '系統錯誤，請稍後再試。';
```

## Related Files

- `gas/StateMachine.gs` - handleBindingState, handleQ6
- `gas/Config.gs` - Add DEBUG_MODE flag

## Priority: Low

This is a nice-to-have feature for future debugging needs.
