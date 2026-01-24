# 後台管理系統

## 功能列表

| 功能 | 說明 |
|------|------|
| 登入/登出 | Supabase Auth (Email/密碼) |
| 儀表板 | 統計卡片、最近訂單 |
| 商品管理 | CRUD、圖片上傳 |
| 訂單管理 | 狀態篩選、批量通知 |

---

## 訂單狀態流程

```
PENDING → 標記已付款 → PAID → 標記已到貨 → ARRIVED
    ↓                                           ↓
  取消                              [批量] 發送通知 → NOTIFIED
(CANCELLED)                                          ↓
                                            標記已取貨 → COMPLETED
```

---

## 頁面與元件路徑對照

### 頁面

| 頁面 | 路徑 | 功能 |
|------|------|------|
| 儀表板 | `src/app/admin/page.tsx` | 統計、最近訂單 |
| 商品管理 | `src/app/admin/products/page.tsx` | 商品 CRUD |
| 訂單管理 | `src/app/admin/orders/page.tsx` | 訂單狀態管理 |
| 佈局 | `src/app/admin/layout.tsx` | 認證檢查、側邊欄 |

### 元件

| 元件 | 路徑 | 功能 |
|------|------|------|
| AuthProvider | `src/components/admin/auth-provider.tsx` | Supabase 認證 Context |
| LoginForm | `src/components/admin/login-form.tsx` | 登入表單 |
| Sidebar | `src/components/admin/sidebar.tsx` | 導航側邊欄 |

---

## 相關 API

| 功能 | API |
|------|-----|
| 商品列表 | `GET /api/products` |
| 新增商品 | `POST /api/products` |
| 更新商品 | `PUT /api/products/:id` |
| 刪除商品 | `DELETE /api/products/:id` |
| 訂單列表 | `GET /api/orders` |
| 更新狀態 | `PUT /api/orders/:id/status` |
| 發送通知 | `POST /api/notify/arrived` |
