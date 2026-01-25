# LINE Rich Menu 技術文件

> 最後更新：2025-01-26
> 官方文檔來源：LINE Developers

## 官方文檔連結

| 文件 | 連結 |
|------|------|
| Rich Menu 概覽 | https://developers.line.biz/en/docs/messaging-api/rich-menus-overview/ |
| 使用 Rich Menu | https://developers.line.biz/en/docs/messaging-api/using-rich-menus/ |
| Per-User Rich Menu | https://developers.line.biz/en/docs/messaging-api/use-per-user-rich-menus/ |
| Tab 切換功能 | https://developers.line.biz/en/docs/messaging-api/switch-rich-menus/ |
| Messaging API Reference | https://developers.line.biz/en/reference/messaging-api/ |

---

## 圖片規格

### 支援的尺寸 (pixels)

| 類型 | 寬度 | 高度 | 用途 |
|------|------|------|------|
| 大版型 | 2500 | 1686 | 完整選單（多按鈕） |
| 小版型 | 2500 | 843 | 精簡選單（少按鈕） |
| 大版型 | 1200 | 810 | 低解析度替代 |
| 小版型 | 1200 | 405 | 低解析度替代 |
| 大版型 | 800 | 540 | 最小尺寸 |
| 小版型 | 800 | 270 | 最小尺寸 |

**推薦使用 2500px 寬度以獲得最佳顯示效果**

### 檔案要求

| 項目 | 規格 |
|------|------|
| 格式 | JPEG 或 PNG |
| 最大檔案大小 | **1 MB** |
| 色彩空間 | RGB |

### 圖片處理指令 (macOS)

```bash
# 大版型 2500x1686（60% 品質確保 < 1MB）
sips -s format jpeg -s formatOptions 60 "input.png" \
    --out "richmenu.jpg" --resampleHeightWidth 1686 2500

# 小版型 2500x843
sips -s format jpeg -s formatOptions 60 "input.png" \
    --out "richmenu.jpg" --resampleHeightWidth 843 2500

# 驗證尺寸
sips -g pixelWidth -g pixelHeight richmenu.jpg

# 驗證檔案大小
ls -lh richmenu.jpg
```

---

## Rich Menu 物件結構

### JSON Schema

```json
{
  "size": {
    "width": 2500,
    "height": 1686
  },
  "selected": true,
  "name": "Menu Name (internal)",
  "chatBarText": "選單",
  "areas": [
    {
      "bounds": {
        "x": 0,
        "y": 0,
        "width": 1250,
        "height": 843
      },
      "action": {
        "type": "postback",
        "data": "action=xxx",
        "displayText": "顯示文字"
      }
    }
  ]
}
```

### 欄位限制

| 欄位 | 限制 |
|------|------|
| name | 最多 300 字元 |
| chatBarText | 最多 14 字元 |
| areas | 最多 20 個區域 |

---

## 支援的 Action 類型

### 1. Postback Action
```json
{
  "type": "postback",
  "data": "action=report",
  "displayText": "我要回報"
}
```
- 傳送資料到 Webhook
- `displayText` 會顯示在聊天室（選填）

### 2. Message Action
```json
{
  "type": "message",
  "text": "Hello"
}
```
- 用戶發送文字訊息

### 3. URI Action
```json
{
  "type": "uri",
  "uri": "https://example.com"
}
```
- 開啟網頁或 LIFF

### 4. Rich Menu Switch Action
```json
{
  "type": "richmenuswitch",
  "richMenuAliasId": "alias-menu-b",
  "data": "switched_to_b"
}
```
- 切換到另一個 Rich Menu（Tab 功能）

---

## API Endpoints

### Rich Menu 管理

| 方法 | Endpoint | 說明 |
|------|----------|------|
| POST | `/v2/bot/richmenu` | 建立 Rich Menu |
| POST | `/v2/bot/richmenu/{richMenuId}/content` | 上傳圖片 |
| GET | `/v2/bot/richmenu/list` | 列出所有 Rich Menu |
| GET | `/v2/bot/richmenu/{richMenuId}` | 取得單一 Rich Menu |
| DELETE | `/v2/bot/richmenu/{richMenuId}` | 刪除 Rich Menu |

### Default Rich Menu

| 方法 | Endpoint | 說明 |
|------|----------|------|
| POST | `/v2/bot/user/all/richmenu/{richMenuId}` | 設定 Default |
| GET | `/v2/bot/user/all/richmenu` | 取得 Default ID |
| DELETE | `/v2/bot/user/all/richmenu` | 清除 Default |

### Per-User Rich Menu

| 方法 | Endpoint | 說明 |
|------|----------|------|
| POST | `/v2/bot/user/{userId}/richmenu/{richMenuId}` | 綁定用戶 |
| GET | `/v2/bot/user/{userId}/richmenu` | 取得用戶的 Menu |
| DELETE | `/v2/bot/user/{userId}/richmenu` | 解除綁定 |
| POST | `/v2/bot/richmenu/bulk/link` | 批次綁定 |
| POST | `/v2/bot/richmenu/bulk/unlink` | 批次解除 |

### Rich Menu Alias（Tab 切換）

| 方法 | Endpoint | 說明 |
|------|----------|------|
| POST | `/v2/bot/richmenu/alias` | 建立 Alias |
| GET | `/v2/bot/richmenu/alias/{richMenuAliasId}` | 取得 Alias |
| DELETE | `/v2/bot/richmenu/alias/{richMenuAliasId}` | 刪除 Alias |
| GET | `/v2/bot/richmenu/alias/list` | 列出所有 Alias |

---

## 顯示優先順序

```
Per-User Rich Menu > Default Rich Menu > LINE Official Account Manager 設定
```

- Per-User 設定會覆蓋 Default
- 設定後立即生效，用戶不需重進聊天室

---

## 本專案 Rich Menu 配置

### Menu 類型

| Menu | 用途 | 尺寸 | 按鈕數 |
|------|------|------|--------|
| Menu_Unbound | 未綁定用戶 | 2500x843 | 1 |
| Menu_Member | 一般組員 | 2500x843 | 3 |
| Menu_Leader | 組長 | 2500x1686 | 6 |

### Menu_Member 區塊配置

```
┌─────────────────────────────────────┐
│     上方區塊 (回報時間提示)           │  y=0, height=295
│     0, 0, 2500x295                  │
├──────────────────┬──────────────────┤
│                  │                  │
│    我要回報       │   查看本週數據    │  y=295, height=548
│    0, 295        │   1250, 295      │
│    1250x548      │   1250x548       │
│                  │                  │
└──────────────────┴──────────────────┘
```

| 區塊 | Bounds | Action |
|------|--------|--------|
| 上方區塊 | x:0, y:0, w:2500, h:295 | `action=show_report_time` |
| 下方左側 | x:0, y:295, w:1250, h:548 | `action=start_report` |
| 下方右側 | x:1250, y:295, w:1250, h:548 | `action=view_my_summary` |

### 切換邏輯

```
新用戶加入 → Menu_Unbound (default)
     ↓
完成姓名綁定 → Menu_Member 或 Menu_Leader (per-user)
```

### 環境變數

```bash
RICH_MENU_UNBOUND_ID=richmenu-xxx
RICH_MENU_MEMBER_ID=richmenu-xxx
RICH_MENU_LEADER_ID=richmenu-xxx
```

---

## 常見問題

### Q: 圖片上傳失敗？
1. 確認尺寸與 JSON `size` 設定**完全一致**
2. 確認檔案大小 < 1MB
3. 確認格式為 JPEG 或 PNG

### Q: Rich Menu 不顯示？
1. 確認已設定 Default 或 Per-User
2. LINE for PC 不支援 Rich Menu，請用手機測試
3. 解除好友再重新加回

### Q: 無法更換圖片？
- Rich Menu 圖片無法更新，需刪除後重建

---

## 相關腳本

```bash
# 列出現有 Rich Menu
./scripts/list-richmenu.sh

# 上傳 Rich Menu（含圖片）
./scripts/upload-richmenu.sh

# 刪除所有 Rich Menu
./scripts/delete-richmenu.sh

# 設定 Default Rich Menu
./scripts/set-default-richmenu.sh <richMenuId>
```

---

## 限制與注意事項

1. **LINE for PC 不支援** - 僅手機版可見
2. **無法同時使用** LINE Official Account Manager 和 Messaging API 管理同一個 Rich Menu
3. **統計數據** - 透過 API 建立的 Rich Menu 無法在 Manager 查看點擊率
4. **圖片不可更新** - 需刪除重建

---

## 參考資源

- [LINE Developers - Rich Menu Overview](https://developers.line.biz/en/docs/messaging-api/rich-menus-overview/)
- [LINE Developers - Using Rich Menus](https://developers.line.biz/en/docs/messaging-api/using-rich-menus/)
- [LINE Developers - Messaging API Reference](https://developers.line.biz/en/reference/messaging-api/)
- [LINE GitHub - Demo Rich Menu Bot](https://github.com/line/demo-rich-menu-bot)
- [Bottender - LINE Rich Menu](https://bottender.js.org/docs/channel-line-rich-menu/)
