# 部署指南

## Step 1: 建立 LINE Messaging API Channel

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 建立新的 Provider（若尚未建立）
3. 建立新的 Messaging API Channel
4. 記錄以下資訊：
   - **Channel ID**
   - **Channel Secret**
   - **Channel Access Token**（在 Messaging API 頁籤發行）

## Step 2: 建立 Google Sheets

1. 前往 [Google Sheets](https://sheets.google.com/) 建立新試算表
2. 將試算表命名為「BNI 引薦回報」
3. 建立 `Group_List` 分頁，設定表頭：
   ```
   小組名稱
   ```
   新增你的小組名稱（每行一個），例如：
   ```
   活力組
   創新組
   卓越組
   ```
4. 建立 `Member_List` 分頁，設定表頭：
   ```
   LINE用戶ID | 真實姓名 | 小組名稱 | 角色 | 狀態
   ```
   - 角色可為：`組長`、`幹部`、`組員`
   - 組長和幹部有管理權限（查看本組回報狀況）
5. 記錄試算表 ID（URL 中 `/d/` 與 `/edit` 之間的部分）

## Step 3: 建立 Google Apps Script 專案

1. 前往 [Google Apps Script](https://script.google.com/)
2. 建立新專案
3. 將專案命名為「BNI-Referral-Bot」
4. 刪除預設的 `Code.gs` 內容
5. 依序建立以下檔案並貼上對應程式碼：
   - `Code.gs`
   - `Config.gs`
   - `LineApi.gs`
   - `RichMenu.gs`
   - `SheetDb.gs`
   - `StateMachine.gs`
   - `TimeUtils.gs`
   - `MessageBuilder.gs`
   - `LeaderFunctions.gs`

6. 更新 `appsscript.json`（點擊「專案設定」→ 勾選「顯示 appsscript.json」）

## Step 4: 設定 Script Properties

1. 在 GAS 編輯器中，點擊「專案設定」（齒輪圖示）
2. 滾動到「指令碼屬性」區塊
3. 新增以下屬性：

| 屬性名稱 | 值 |
|---------|-----|
| LINE_CHANNEL_ACCESS_TOKEN | 你的 Channel Access Token |
| LINE_CHANNEL_SECRET | 你的 Channel Secret |
| SPREADSHEET_ID | 你的試算表 ID |

## Step 5: 部署 Web App

1. 點擊「部署」→「新增部署作業」
2. 選擇類型：「網頁應用程式」
3. 設定：
   - 說明：`v1.0`
   - 執行身分：`我`
   - 誰可以存取：`所有人`
4. 點擊「部署」
5. 複製「網頁應用程式網址」

## Step 6: 設定 LINE Webhook

1. 回到 LINE Developers Console
2. 進入你的 Channel → Messaging API 頁籤
3. 設定 Webhook URL：貼上 GAS Web App 網址
4. 開啟「Use webhook」
5. 關閉「Auto-reply messages」
6. 關閉「Greeting messages」

## Step 7: 建立 Rich Menu

1. 在 GAS 編輯器中，選擇 `RichMenu.gs`
2. 選擇執行函數：`createAllRichMenus`
3. 點擊「執行」
4. 授權存取權限
5. 查看執行記錄，記錄三個 Rich Menu ID

## Step 8: 上傳 Rich Menu 圖檔

Rich Menu 圖檔規格：

| 選單 | 尺寸 (px) | 按鈕配置 |
|------|----------|---------|
| Unbound | 2500 x 843 | 1 個按鈕 |
| Member | 2500 x 843 | 2 個按鈕（各佔一半） |
| Leader | 2500 x 1686 | 5 個按鈕（2+3 排列） |

### 上傳方式

使用 curl 或 Postman 上傳圖檔：

```bash
curl -X POST https://api-data.line.me/v2/bot/richmenu/{richMenuId}/content \
  -H "Authorization: Bearer {channelAccessToken}" \
  -H "Content-Type: image/png" \
  --data-binary @/path/to/image.png
```

或在 GAS 中使用 `uploadRichMenuImage()` 函數。

## Step 9: 設定預設 Rich Menu

在 GAS 中執行：

```javascript
function setUnboundAsDefault() {
  const unboundId = PropertiesService.getScriptProperties().getProperty('RICH_MENU_UNBOUND_ID');
  setDefaultRichMenu(unboundId);
}
```

## Step 10: 測試

1. 加入 LINE Bot 為好友
2. 測試綁定流程
3. 測試回報流程（在開放時段）
4. 測試查看數據功能

## 常見問題

### Q: Webhook 沒有反應？
A: 確認 GAS 已正確部署，且 LINE Webhook URL 設定正確。

### Q: 時間判斷不正確？
A: 確認 `appsscript.json` 中的 `timeZone` 設定為 `Asia/Taipei`。

### Q: Rich Menu 沒有顯示？
A: 確認已上傳圖檔，且已執行 `linkRichMenuToUser()` 或設定預設選單。

## 維護

### 新增組長/幹部

在 `Member_List` 中將該成員的「角色」欄位改為：
- `組長`：有管理權限
- `幹部`：有管理權限
- `組員`：一般組員

修改後需重新綁定 Rich Menu（執行 `assignRichMenuByStatus(userId)`）。

### 新增小組

在 `Group_List` 分頁新增一行小組名稱即可。

### 查看記錄

在 GAS 編輯器中，點擊「執行」→「執行記錄」查看執行歷程。

### 手動發送提醒

執行 `sendReminderToNotReported()` 函數，對未回報成員發送提醒訊息。

可指定小組：`sendReminderToNotReported(null, '活力組')`
