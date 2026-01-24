# Shioaji Quick Start Guide

**Source:** https://sinotrade.github.io/quickstart/
**Documentation:** https://sinotrade.github.io/

Shioaji is a Python trading API library for Taiwan and global financial markets. Designed to be straightforward for Python developers to integrate with NumPy, pandas, PyTorch, TensorFlow, etc.

---

## Prerequisites

Before starting, you must complete these preparation steps:

1. Open a SinoPac Securities account
2. Accept terms of service
3. Obtain API tokens/certificates
4. **Important:** Ensure your computer time is synchronized with the server to avoid "Sign data is timeout" errors

---

## Installation

```bash
pip install shioaji
```

---

## 1. Authentication & Login

### Version ≥ 1.0 (Token-Based Login) - Recommended

```python
import shioaji as sj

# Initialize API
api = sj.Shioaji()

# Login with API credentials
api.login(
    api_key="YOUR_API_KEY",
    secret_key="YOUR_SECRET_KEY"
)
```

#### Login Parameters (v1.0+)

- `api_key` (str): Authentication identifier
- `secret_key` (str): Authentication secret
- `fetch_contract` (bool): Load contracts from cache or server (default: True)
- `contracts_timeout` (int): Contract fetch timeout in milliseconds (default: 0)
- `contracts_cb` (Callable): Optional progress callback
- `subscribe_trade` (bool): Auto-subscribe to order/deal events (default: True)
- `receive_window` (int): Valid login execution duration in ms (default: 30,000)

**Note:** Adjust `receive_window` if login execution exceeds the valid timeframe.

### Version < 1.0 (Credentials-Based Login) - Legacy

```python
import shioaji as sj

# Initialize API
api = sj.Shioaji()

# Login with person ID and password
api.login(
    person_id="YOUR_PERSON_ID",
    passwd="YOUR_PASSWORD"
)
```

#### Login Parameters (v < 1.0)

- `person_id` (str): Account identifier
- `passwd` (str): Account password
- `hashed` (bool): Whether password is pre-hashed (default: False)
- Similar contract and trade subscription parameters as v1.0

---

## 2. CA Certificate Activation

After login, activate the certification authority (CA):

```python
# Activate CA certificate
api.activate_ca(
    ca_path="C:/path/to/your/certificate.pfx",  # Use forward slashes
    ca_passwd="YOUR_CA_PASSWORD",
    person_id="YOUR_PERSON_ID"
)
```

**Important Notes:**
- Convert Windows backslashes (`\`) to forward slashes (`/`) in the CA file path
- The CA password is required for certificate activation
- Use the Person ID associated with the certificate

---

## 3. Account Management

### List All Accounts

```python
# Get all available accounts
accounts = api.list_accounts()
print(accounts)
```

### Set Default Account

```python
# Set a specific account as default
api.set_default_account(accounts[1])
```

### Access Default Futures Account

```python
# Access the default futures/options account
print(api.futopt_account)
```

---

## 4. Trade Subscription

### Enable Trade Subscription

Trade subscription can be enabled during login (`subscribe_trade=True`) or manually:

```python
# Subscribe to trade events for an account
api.subscribe_trade(account)
```

### Disable Trade Subscription

```python
# Unsubscribe from trade events
api.unsubscribe_trade(account)
```

---

## 5. Market Data Streaming

Subscribe to real-time market quotes:

```python
# Subscribe to tick data for a stock (TSMC - 2330)
api.quote.subscribe(
    api.Contracts.Stocks["2330"],
    quote_type="tick"
)

# Subscribe to bid/ask data
api.quote.subscribe(
    api.Contracts.Stocks["2330"],
    quote_type="bidask"
)
```

**Quote Types:**
- `tick`: Real-time tick data
- `bidask`: Real-time bid/ask data

---

## 6. Order Placement

### Define and Place an Order

```python
# Define order parameters
order = api.Order(
    price=100,           # Order price
    quantity=1,          # Order quantity
    action="Buy",        # "Buy" or "Sell"
    price_type="LMT",    # "LMT" (Limit), "MKT" (Market), etc.
    order_type="ROD"     # "ROD" (Rest of Day), "IOC", "FOK", etc.
)

# Place the order
trade = api.place_order(
    contract=api.Contracts.Stocks["2330"],
    order=order
)
```

**Common Parameters:**
- **action**: `"Buy"` or `"Sell"`
- **price_type**:
  - `"LMT"`: Limit order
  - `"MKT"`: Market order
- **order_type**:
  - `"ROD"`: Rest of Day
  - `"IOC"`: Immediate or Cancel
  - `"FOK"`: Fill or Kill

---

## 7. Logout

```python
# Logout from the API
api.logout()  # Returns: True
```

---

## Additional Resources

- **Login Tutorial:** https://sinotrade.github.io/tutor/login/
- **Contract Tutorial:** https://sinotrade.github.io/tutor/contract/
- **Market Data (Stocks):** https://sinotrade.github.io/tutor/market_data/streaming/stocks/
- **Market Data (Futures):** https://sinotrade.github.io/tutor/market_data/streaming/futures/
- **Historical Data:** https://sinotrade.github.io/tutor/market_data/historical/
- **Release Notes:** https://sinotrade.github.io/release/
- **C# Quick Start:** https://sinotrade.github.io/Shioaji.Csharp/quickstart/
- **QA:** https://sinotrade.github.io/qa/

---

## Quick Example - Complete Workflow

```python
import shioaji as sj

# 1. Initialize and login
api = sj.Shioaji()
api.login(
    api_key="YOUR_API_KEY",
    secret_key="YOUR_SECRET_KEY"
)

# 2. Activate CA certificate
api.activate_ca(
    ca_path="C:/path/to/certificate.pfx",
    ca_passwd="YOUR_CA_PASSWORD",
    person_id="YOUR_PERSON_ID"
)

# 3. List and set account
accounts = api.list_accounts()
api.set_default_account(accounts[0])

# 4. Subscribe to market data
api.quote.subscribe(
    api.Contracts.Stocks["2330"],
    quote_type="tick"
)

# 5. Place an order
order = api.Order(
    price=500,
    quantity=1,
    action="Buy",
    price_type="LMT",
    order_type="ROD"
)
trade = api.place_order(
    contract=api.Contracts.Stocks["2330"],
    order=order
)

# 6. Logout when done
api.logout()
```

---

## Important Notes

1. **Time Synchronization:** Ensure your system time is synchronized with the server
2. **API Credentials:** Keep your API keys and secrets secure
3. **CA Certificate:** Required for placing orders and certain operations
4. **Version Check:** Use token-based login for version ≥ 1.0
5. **Testing:** Always test with small quantities first in a paper trading environment

---

**Last Updated:** 2025-12-23
**API Version:** Focus on v1.0+ (Token-based authentication)
