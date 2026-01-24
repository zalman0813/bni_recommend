# LIFF 客人端應用

## 功能列表

| 功能 | 說明 |
|------|------|
| 商品瀏覽 | 瀏覽上架商品 |
| 購物車 | 加入商品、調整數量 |
| 下單 | 確認並送出訂單 |
| 我的訂單 | 查看訂單狀態 |

---

## 購物流程

```
開啟 LIFF → 登入驗證 → 瀏覽商品 → 加入購物車
                                      ↓
              我的訂單 ← 下單成功 ← 確認下單
```

---

## 頁面與元件路徑對照

### 頁面

| 頁面 | 路徑 | 功能 |
|------|------|------|
| 商品列表 | `src/app/liff/page.tsx` | 瀏覽商品、加入購物車 |
| 購物車 | `src/app/liff/cart/page.tsx` | 結帳、確認下單 |
| 我的訂單 | `src/app/liff/orders/page.tsx` | 訂單狀態查看 |
| 佈局 | `src/app/liff/layout.tsx` | LIFF 初始化、底部導航 |

### 元件

| 元件 | 路徑 | 功能 |
|------|------|------|
| LiffProvider | `src/components/liff/liff-provider.tsx` | LIFF SDK Context |
| CartProvider | `src/components/liff/cart-provider.tsx` | 購物車 Context |

---

## 狀態管理

### LiffProvider

```typescript
{
  isReady: boolean      // LIFF 初始化完成
  isLoggedIn: boolean   // 用戶已登入
  isInClient: boolean   // 在 LINE 客戶端內
  profile: LiffProfile  // 用戶資訊
  login: () => void     // 觸發登入
  error: string | null  // 錯誤訊息
}
```

### CartProvider

```typescript
{
  items: CartItem[]                   // 購物車品項
  addItem: (product, qty?) => void    // 加入商品
  removeItem: (productId) => void     // 移除商品
  updateQuantity: (id, qty) => void   // 更新數量
  clearCart: () => void               // 清空購物車
  totalAmount: number                 // 訂單總額
  totalItems: number                  // 品項總數
}
```

**儲存位置：** `localStorage` (key: `group-buy-cart`)

---

## 相關 API

| 功能 | API |
|------|-----|
| 商品列表 | `GET /api/products?active=true` |
| 建立訂單 | `POST /api/orders` |
| 我的訂單 | `GET /api/orders/my?userId=xxx` |
