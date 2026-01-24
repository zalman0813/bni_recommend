# API 端點參考

## 端點列表

### Webhook

| 方法 | 路徑 | 用途 |
|------|------|------|
| `POST` | `/api/webhook` | LINE 事件接收 |
| `GET` | `/api/webhook` | 健康檢查 |

### 商品 API

| 方法 | 路徑 | 用途 |
|------|------|------|
| `GET` | `/api/products` | 取得商品列表 |
| `POST` | `/api/products` | 新增商品 |
| `GET` | `/api/products/:id` | 取得單一商品 |
| `PUT` | `/api/products/:id` | 更新商品 |
| `DELETE` | `/api/products/:id` | 刪除商品 |

**查詢參數：**
- `GET /api/products?active=true` - 僅取得上架商品

### 訂單 API

| 方法 | 路徑 | 用途 |
|------|------|------|
| `GET` | `/api/orders` | 取得訂單列表 (Admin) |
| `POST` | `/api/orders` | 建立訂單 (LIFF) |
| `GET` | `/api/orders/my?userId=xxx` | 取得用戶訂單 (LIFF) |
| `PUT` | `/api/orders/:id/status` | 更新訂單狀態 (Admin) |

**查詢參數：**
- `GET /api/orders?status=PENDING` - 依狀態篩選

### 通知 API

| 方法 | 路徑 | 用途 |
|------|------|------|
| `POST` | `/api/notify/arrived` | 發送到貨通知 |

---

## 請求/回應格式

### 建立訂單 `POST /api/orders`

```json
// Request
{
  "userId": "LINE_USER_ID",
  "items": [
    { "productId": "xxx", "quantity": 2 }
  ]
}

// Response
{
  "id": "order_id",
  "status": "PENDING",
  "totalAmount": 598,
  "items": [...]
}
```

### 更新訂單狀態 `PUT /api/orders/:id/status`

```json
// Request
{
  "status": "PAID"
}
```

### 發送到貨通知 `POST /api/notify/arrived`

```json
// Request
{
  "orderIds": ["order-id-1", "order-id-2"]
}

// Response
{
  "success": true,
  "message": "Sent 2 notification(s), 0 failed",
  "results": [
    { "orderId": "xxx", "success": true }
  ]
}
```

---

## 相關檔案

| 檔案路徑 | 說明 |
|---------|------|
| `src/app/api/webhook/route.ts` | Webhook 處理 |
| `src/app/api/products/route.ts` | 商品列表/新增 |
| `src/app/api/products/[id]/route.ts` | 商品單筆操作 |
| `src/app/api/orders/route.ts` | 訂單列表/建立 |
| `src/app/api/orders/my/route.ts` | 用戶訂單查詢 |
| `src/app/api/orders/[id]/status/route.ts` | 訂單狀態更新 |
| `src/app/api/notify/arrived/route.ts` | 到貨通知 |
