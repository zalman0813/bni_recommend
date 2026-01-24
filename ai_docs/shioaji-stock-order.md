# Shioaji 股票下單 API 文件

## 來源

- 主要文件: https://sinotrade.github.io/tutor/order/Stock/
- API 參考: https://sinotrade.github.io/post/

---

## 訂單屬性 (Order Attributes)

Shioaji 股票訂單物件支援以下參數：

| 參數 | 型別 | 說明 |
|------|------|------|
| `price` | float/int | 委託價格 |
| `quantity` | int | 委託數量 |
| `action` | Action | 買進或賣出 (`Buy` / `Sell`) |
| `price_type` | StockPriceType | 價格類型 (`LMT` 限價 / `MKT` 市價 / `MKP` 範圍市價) |
| `order_type` | OrderType | 委託類型 (`ROD` 整日有效 / `IOC` 立即成交否則取消 / `FOK` 全部成交否則取消) |
| `order_cond` | OrderCond | 委託條件 (`Cash` 現股 / `MarginTrading` 融資 / `ShortSelling` 融券) |
| `order_lot` | StockOrderLot | 交易單位 (`Common` 整股 / `Fixing` 定盤 / `Odd` 盤後零股 / `IntradayOdd` 盤中零股) |
| `daytrade_short` | bool | 當沖賣出 (先賣後買) |
| `first_sell` | bool | 現股當沖賣出 |
| `custom_field` | str | 自訂欄位，最多 6 個英數字 |
| `account` | Account | 目標交易帳戶 |
| `ca` | CA | 憑證授權 |

---

## 下單方式

### 基本下單

使用 `place_order()` 方法需要提供合約 (Contract) 和訂單 (Order) 物件：

```python
# Get contract
contract = api.Contracts.Stocks.TSE.TSE2890

# Create order
order = api.Order(
    price=17,
    quantity=3,
    action=sj.constant.Action.Buy,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,
    order_lot=sj.constant.StockOrderLot.Common,
    account=api.stock_account
)

# Place order
trade = api.place_order(contract, order)
```

### 簡化下單方式

**市價單 (MarketOrder):**
```python
order = api.MarketOrder(
    action=sj.constant.Action.Buy,
    quantity=1,
    order_type=sj.constant.OrderType.ROD  # optional
)
trade = api.place_order(contract, order)
```

**限價單 (LimitOrder):**
```python
order = api.LimitOrder(
    action=sj.constant.Action.Sell,
    price=17.5,
    quantity=2,
    order_type=sj.constant.OrderType.ROD  # optional
)
trade = api.place_order(contract, order)
```

---

## 訂單類型範例

### 1. 現股買進 (整股)

```python
order = api.Order(
    price=100,
    quantity=1,  # 1 lot = 1000 shares
    action=sj.constant.Action.Buy,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,
    order_cond=sj.constant.StockOrderCond.Cash,
    order_lot=sj.constant.StockOrderLot.Common,
    account=api.stock_account
)
```

### 2. 融資買進

```python
order = api.Order(
    price=50,
    quantity=2,
    action=sj.constant.Action.Buy,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,
    order_cond=sj.constant.StockOrderCond.MarginTrading,
    order_lot=sj.constant.StockOrderLot.Common,
    account=api.stock_account
)
```

### 3. 融券賣出

```python
order = api.Order(
    price=120,
    quantity=1,
    action=sj.constant.Action.Sell,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,
    order_cond=sj.constant.StockOrderCond.ShortSelling,
    order_lot=sj.constant.StockOrderLot.Common,
    account=api.stock_account
)
```

### 4. 當沖交易 (先買後賣)

```python
# Buy first
order_buy = api.Order(
    price=80,
    quantity=1,
    action=sj.constant.Action.Buy,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,
    order_cond=sj.constant.StockOrderCond.Cash,
    order_lot=sj.constant.StockOrderLot.Common,
    account=api.stock_account
)

# Sell for day trading
order_sell = api.Order(
    price=82,
    quantity=1,
    action=sj.constant.Action.Sell,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,
    order_cond=sj.constant.StockOrderCond.Cash,
    order_lot=sj.constant.StockOrderLot.Common,
    first_sell=True,  # Enable day trading sell
    account=api.stock_account
)
```

### 5. 當沖交易 (先賣後買)

```python
# Short sell first
order_sell = api.Order(
    price=85,
    quantity=1,
    action=sj.constant.Action.Sell,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,
    order_cond=sj.constant.StockOrderCond.Cash,
    order_lot=sj.constant.StockOrderLot.Common,
    daytrade_short=True,  # Enable day trading short
    account=api.stock_account
)
```

### 6. 零股交易

```python
# Odd lot (after-hours)
order = api.Order(
    price=100,
    quantity=100,  # shares, not lots
    action=sj.constant.Action.Buy,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,
    order_cond=sj.constant.StockOrderCond.Cash,
    order_lot=sj.constant.StockOrderLot.Odd,
    account=api.stock_account
)

# Intraday odd lot
order = api.Order(
    price=100,
    quantity=100,
    action=sj.constant.Action.Buy,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,
    order_cond=sj.constant.StockOrderCond.Cash,
    order_lot=sj.constant.StockOrderLot.IntradayOdd,
    account=api.stock_account
)
```

### 7. 市價單

```python
order = api.Order(
    quantity=1,
    action=sj.constant.Action.Buy,
    price_type=sj.constant.StockPriceType.MKT,
    order_type=sj.constant.OrderType.ROD,
    order_lot=sj.constant.StockOrderLot.Common,
    account=api.stock_account
)
```

### 8. IOC / FOK 訂單

```python
# IOC (Immediate or Cancel)
order_ioc = api.Order(
    price=90,
    quantity=2,
    action=sj.constant.Action.Buy,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.IOC,
    order_lot=sj.constant.StockOrderLot.Common,
    account=api.stock_account
)

# FOK (Fill or Kill)
order_fok = api.Order(
    price=90,
    quantity=2,
    action=sj.constant.Action.Buy,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.FOK,
    order_lot=sj.constant.StockOrderLot.Common,
    account=api.stock_account
)
```

---

## 修改訂單

### 改價 (Update Price)

```python
api.update_order(trade=trade, price=17.5)
```

### 減量 (Reduce Quantity)

```python
api.update_order(trade=trade, qty=1)
```

**注意事項:**
- 數量只能減少，不能增加
- 無法同時改價和改量

---

## 取消訂單

```python
api.cancel_order(trade)
```

---

## 訂單狀態查詢

### 更新訂單狀態

```python
api.update_status(api.stock_account)
```

### 訂單狀態類型

| 狀態 | 說明 |
|------|------|
| `PendingSubmit` | 等待送出 |
| `PreSubmitted` | 預先送出 |
| `Submitted` | 已送出 |
| `Failed` | 失敗 |
| `Cancelled` | 已取消 |
| `Filled` | 完全成交 |
| `PartFilled` | 部分成交 |

### 查詢委託紀錄

```python
trades = api.list_trades()
```

---

## 帳戶與部位查詢

### 查詢帳戶權益與保證金

```python
margin = api.get_account_margin()
```

### 查詢目前持倉

```python
positions = api.get_account_openposition()
# Can convert to pandas DataFrame
import pandas as pd
df = pd.DataFrame(positions)
```

### 查詢已平倉損益

```python
pnl = api.get_account_settle_profitloss()
```

---

## Trade 物件說明

`place_order()` 會回傳一個 Trade 物件，包含：

- **Contract**: 合約資訊
- **Order**: 訂單資訊
- **OrderStatus**: 訂單狀態

範例:
```python
trade = api.place_order(contract, order)

print(f"Contract: {trade.contract}")
print(f"Order: {trade.order}")
print(f"Status: {trade.status}")
```

---

## 常用常數參考

### Action (買賣別)
```python
sj.constant.Action.Buy   # 買進
sj.constant.Action.Sell  # 賣出
```

### StockPriceType (價格類型)
```python
sj.constant.StockPriceType.LMT  # 限價
sj.constant.StockPriceType.MKT  # 市價
sj.constant.StockPriceType.MKP  # 範圍市價
```

### OrderType (委託類型)
```python
sj.constant.OrderType.ROD  # Rest of Day (整日有效)
sj.constant.OrderType.IOC  # Immediate or Cancel (立即成交否則取消)
sj.constant.OrderType.FOK  # Fill or Kill (全部成交否則取消)
```

### StockOrderCond (委託條件)
```python
sj.constant.StockOrderCond.Cash           # 現股
sj.constant.StockOrderCond.MarginTrading  # 融資
sj.constant.StockOrderCond.ShortSelling   # 融券
```

### StockOrderLot (交易單位)
```python
sj.constant.StockOrderLot.Common       # 整股
sj.constant.StockOrderLot.Fixing       # 定盤
sj.constant.StockOrderLot.Odd          # 盤後零股
sj.constant.StockOrderLot.IntradayOdd  # 盤中零股
```

---

## 完整下單流程範例

```python
import shioaji as sj

# Login
api = sj.Shioaji()
api.login(
    person_id="YOUR_ID",
    passwd="YOUR_PASSWORD"
)

# Activate CA
api.activate_ca(
    ca_path="YOUR_CA_PATH",
    ca_passwd="YOUR_CA_PASSWORD",
    person_id="YOUR_ID"
)

# Get contract
contract = api.Contracts.Stocks.TSE.TSE2330  # TSMC

# Create order
order = api.Order(
    price=600,
    quantity=1,
    action=sj.constant.Action.Buy,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,
    order_cond=sj.constant.StockOrderCond.Cash,
    order_lot=sj.constant.StockOrderLot.Common,
    account=api.stock_account
)

# Place order
trade = api.place_order(contract, order)

# Check status
print(f"Order Status: {trade.status.status}")

# Update order (change price)
api.update_order(trade=trade, price=605)

# Or cancel order
# api.cancel_order(trade)

# Logout
api.logout()
```

---

## 注意事項

1. **下單前必須先登入並啟用憑證** (`activate_ca`)
2. **整股交易**: `quantity` 單位為「張」，1 張 = 1000 股
3. **零股交易**: `quantity` 單位為「股」
4. **改單限制**: 只能減量不能加量，無法同時改價改量
5. **當沖交易**: 需設定 `daytrade_short=True` (先賣後買) 或 `first_sell=True` (先買後賣)
6. **市價單**: 不需設定 `price` 參數
7. **自訂欄位**: `custom_field` 可用於追蹤或標記訂單，最多 6 個英數字

---

## 相關資源

- [Shioaji 官方文件](https://sinotrade.github.io/)
- [GitHub Repository](https://github.com/Sinotrade/Shioaji)
- [PyPI Package](https://pypi.org/project/shioaji/)
