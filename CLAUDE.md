# Project: BNI 引薦回報 LINE Bot

## Tech Stack
- Google Apps Script (GAS) + Google Sheets as DB
- LINE Messaging API
- Deployment: GAS Web App

## Language Rules
- Code comments: English only
- User-facing messages (LINE reply): Traditional Chinese
- Claude responses to user: Traditional Chinese

## Google Apps Script (GAS) Pitfalls

### Sheet 讀取的資料型別
- **Sheet 中的日期欄位讀出來是 JavaScript `Date` 物件，不是字串**
- 用 `sheet.getDataRange().getValues()` 取值時，日期儲存格回傳的是 `Date`，不是 `formatTimestamp()` 產生的 `"yyyy/MM/dd HH:mm:ss"` 字串
- 正確做法：先用 `instanceof Date` 判斷，再決定是否需要 parse

```javascript
// WRONG - assumes string
const parts = String(timestamp).match(/(\d{4})\/(\d{2})\/(\d{2})/);

// CORRECT - handle native Date object
if (timestamp instanceof Date) {
  dateObj = timestamp;
} else {
  // fallback: parse string format
}
```

### GAS 沒有 console.log
- 用 `Logger.log()` 而非 `console.log()`
- 在 GAS 編輯器的「執行記錄」中查看輸出

### GAS 時區
- GAS 預設時區由專案設定決定（appsscript.json）
- 本專案所有時間邏輯都透過 `getTaipeiTime()` 統一轉換為 UTC+8
- 不要直接用 `new Date()` 做日期比較，一律先轉台北時間

## Refactoring Discipline
- **刪除或重新命名變數後，必須全域搜尋該變數名稱，確認所有引用都已更新**
- 特別注意 `Logger.log()` 等 debug 行容易遺漏

## Business Logic: 營業週期

### 一期 = 週四 09:30 ~ 週三 23:59（台北時間）
- `getIsoWeekString()` 透過 **減 3 天** 將 ISO 週邊界從 Mon-Sun 平移到 Thu-Wed
- 所有 Sheet 讀寫路徑都透過 `getIsoWeekString()` 取得週次名稱，改一處全部生效
- Sheet 命名格式：`YYYY-Www`（例如 `2026-W06`）

### 顯示時間 vs 系統時間
- LINE 回覆的阻擋訊息顯示「週三 21:00」→ 心理催促使用者提早回報
- 系統實際 `isReportingPeriodOpen()` 截止時間為 23:59 → 給予緩衝
- **兩者刻意不同步，不要「修正」顯示時間為 23:59**

## File Structure (gas/)
| File | Purpose |
|------|---------|
| `Config.gs` | Environment config, spreadsheet ID, LINE token |
| `Code.gs` | Main entry point, doPost webhook handler |
| `TimeUtils.gs` | Time control, ISO week calculation, reporting period |
| `SheetDb.gs` | Google Sheet CRUD, weekly sheet management |
| `StateMachine.gs` | Conversation state machine for LINE Bot |
| `MessageBuilder.gs` | LINE message formatting |
| `LeaderFunctions.gs` | Leader-specific stats, ranking, export |
| `LineApi.gs` | LINE API wrapper (reply, push, rich menu) |
| `RichMenu.gs` | Rich menu setup |
