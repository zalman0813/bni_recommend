# 資料庫設計

## Model 列表

| Model | 用途 |
|-------|------|
| `Product` | 商品資料 |
| `LineUser` | LINE 用戶資料 |
| `Order` | 訂單主檔 |
| `OrderItem` | 訂單明細 |
| `OrderStatus` | 訂單狀態列舉 |

---

## 欄位速查表

### Product（商品）

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | String (CUID) | 主鍵 |
| `name` | String | 商品名稱 |
| `description` | String? | 描述 |
| `price` | Int | 價格（整數） |
| `imageUrl` | String? | 圖片 URL |
| `stock` | Int | 庫存數量 |
| `isActive` | Boolean | 是否上架 |
| `createdAt` | DateTime | 建立時間 |
| `updatedAt` | DateTime | 更新時間 |

### LineUser（LINE 用戶）

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | String | LINE userId（主鍵）|
| `displayName` | String? | 顯示名稱 |
| `pictureUrl` | String? | 頭像 URL |
| `createdAt` | DateTime | 建立時間 |

### Order（訂單）

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | String (CUID) | 主鍵 |
| `userId` | String | 外鍵 → LineUser |
| `status` | OrderStatus | 訂單狀態 |
| `totalAmount` | Int | 訂單總金額 |
| `createdAt` | DateTime | 建立時間 |
| `updatedAt` | DateTime | 更新時間 |

### OrderItem（訂單明細）

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | String (CUID) | 主鍵 |
| `orderId` | String | 外鍵 → Order |
| `productId` | String | 外鍵 → Product |
| `quantity` | Int | 購買數量 |
| `price` | Int | 下單時價格快照 |

### OrderStatus（訂單狀態列舉）

| 值 | 說明 |
|----|------|
| `PENDING` | 待付款 |
| `PAID` | 已付款 |
| `ARRIVED` | 已到貨 |
| `NOTIFIED` | 已通知 |
| `COMPLETED` | 已完成 |
| `CANCELLED` | 已取消 |

---

## 關聯圖

```
LineUser (1) ──────< (n) Order
Order (1) ──────< (n) OrderItem
Product (1) ──────< (n) OrderItem
```

---

## 相關檔案

| 檔案 | 說明 |
|------|------|
| `prisma/schema.prisma` | Schema 定義 |
| `src/lib/db/prisma.ts` | Prisma Client 單例 |
