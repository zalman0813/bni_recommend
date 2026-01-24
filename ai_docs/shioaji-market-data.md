# Shioaji Market Data Documentation

**Source:** https://sinotrade.github.io/tutor/market_data/

**Last Updated:** 2025-12-23

Taiwan stock trading API - Comprehensive market data retrieval guide

---

## Table of Contents

1. [Real-time Quote Subscription](#real-time-quote-subscription)
2. [Tick Data Format](#tick-data-format)
3. [Historical Data Retrieval](#historical-data-retrieval)
4. [Snapshot Data](#snapshot-data)
5. [Code Examples](#code-examples)

---

## Real-time Quote Subscription

### Subscribe Function

Use `api.quote.subscribe()` to stream real-time market data.

**Method Signature:**
```python
api.quote.subscribe(
    contract,           # Stock contract object
    quote_type,         # 'Tick', 'BidAsk', or 'Quote'
    intraday_odd=False, # Boolean for odd-lot shares (盤中零股)
    version='v1'        # Quote format version ('v0' or 'v1')
)
```

### Quote Types

#### 1. Tick Data (v1)
Real-time trade information including:
- Code, datetime
- Open, high, low, close prices
- Volume, total amount
- Tick classification (buy/sell side)
- `tick_type`: 1=external market, 2=internal market
- `chg_type`: 1=limit up, 2=up, 3=unchanged, 4=down, 5=limit down

**Key Attributes:**
- `volume`: Current trade volume
- `total_volume`: Cumulative volume
- `price_chg`: Price change
- `pct_chg`: Percentage change
- `bid_side_total_vol`/`ask_side_total_vol`: Total bid/ask volumes
- `bid_side_total_cnt`/`ask_side_total_cnt`: Total bid/ask counts
- `suspend`: Suspension flag

#### 2. BidAsk Data (v1)
Five levels of bid/ask depth with volume tracking:
- Five-level bid/ask prices
- Five-level bid/ask volumes
- Volume change tracking (`diff_bid_vol`, `diff_ask_vol`)
- Differential tracking at each price level

**Key Attributes:**
- `bid_price[0-4]`: Five levels of bid prices
- `bid_volume[0-4]`: Five levels of bid volumes
- `ask_price[0-4]`: Five levels of ask prices
- `ask_volume[0-4]`: Five levels of ask volumes
- `diff_bid_vol[0-4]`: Volume changes for each bid level
- `diff_ask_vol[0-4]`: Volume changes for each ask level

#### 3. Quote Data (v1)
Comprehensive snapshot combining tick + bid-ask information:
- All tick data fields
- All bid-ask depth fields
- `avail_borrowing`: Short selling availability
- After-hours odd-lot details

### Callback Implementation

**Option 1: Decorator Pattern (Recommended)**
```python
@api.on_tick_stk_v1()
def quote_callback(exchange: Exchange, tick: TickSTKv1):
    print(f"Exchange: {exchange}, Tick: {tick}")
    print(f"Price: {tick.close}, Volume: {tick.volume}")
```

**Option 2: Traditional Method**
```python
def quote_callback(exchange, tick):
    print(f"Exchange: {exchange}, Tick: {tick}")

api.quote.set_on_tick_stk_v1_callback(quote_callback)
```

**BidAsk Callback:**
```python
@api.on_bidask_stk_v1()
def bidask_callback(exchange: Exchange, bidask: BidAskSTKv1):
    print(f"Best Bid: {bidask.bid_price[0]} x {bidask.bid_volume[0]}")
    print(f"Best Ask: {bidask.ask_price[0]} x {bidask.ask_volume[0]}")
```

**Quote Callback:**
```python
@api.on_quote_stk_v1()
def quote_callback(exchange: Exchange, quote: QuoteSTKv1):
    print(f"Last Price: {quote.close}")
    print(f"Best Bid: {quote.bid_price[0]}, Best Ask: {quote.ask_price[0]}")
```

---

## Tick Data Format

### Tick Record Structure

Each tick contains the following information:

```python
{
    'code': '2330',              # Stock code
    'datetime': datetime,        # Timestamp
    'open': 585.0,              # Open price
    'high': 585.0,              # High price
    'low': 585.0,               # Low price
    'close': 585.0,             # Close price
    'volume': 1000,             # Trade volume
    'total_volume': 12345678,   # Cumulative volume
    'amount': 585000,           # Trade amount
    'total_amount': 7234567890, # Cumulative amount
    'tick_type': 1,             # 1=external, 2=internal
    'chg_type': 2,              # 1=limit up, 2=up, 3=unchanged, 4=down, 5=limit down
    'price_chg': 5.0,           # Price change
    'pct_chg': 0.86,            # Percentage change
    'bid_side_total_vol': 5678, # Total bid volume
    'ask_side_total_vol': 4321, # Total ask volume
    'bid_side_total_cnt': 123,  # Total bid count
    'ask_side_total_cnt': 98,   # Total ask count
    'suspend': False            # Trading suspension flag
}
```

### Tick Type Classification

- **External Market (tick_type=1)**: Trade executed at ask price (buyer initiated)
- **Internal Market (tick_type=2)**: Trade executed at bid price (seller initiated)

### Change Type Classification

- **1**: Limit Up (漲停)
- **2**: Up (上漲)
- **3**: Unchanged (平盤)
- **4**: Down (下跌)
- **5**: Limit Down (跌停)

---

## Historical Data Retrieval

### Ticks Data

Retrieve tick-level historical market data using `api.ticks()`.

**Method Signature:**
```python
api.ticks(
    contract,                    # Contract object
    date='',                     # Trading date (default: last trading day)
    query_type=TicksQueryType,   # Query mode
    time_start='',               # Start time for range query
    time_end='',                 # End time for range query
    last_cnt=0,                  # Number of last ticks to retrieve
    timeout=30000,               # Timeout in milliseconds
    cb=None                      # Optional callback function
)
```

**Query Modes:**

1. **By Date**: Retrieve all ticks for a specific trading day
   ```python
   ticks = api.ticks(contract, date='2025-12-23')
   ```

2. **Range Time**: Filter ticks within a time window
   ```python
   ticks = api.ticks(
       contract,
       date='2025-12-23',
       time_start='09:00:00',
       time_end='13:30:00'
   )
   ```

3. **Last Count**: Get the most recent N ticks
   ```python
   ticks = api.ticks(contract, last_cnt=100)
   ```

**Tick Record Fields:**
- Timestamp
- Close price
- Volume
- Bid/ask prices and volumes
- Tick classification (external/internal market indicator)

### KBar Data

Retrieve candlestick data using `api.kbars()`.

**Method Signature:**
```python
api.kbars(
    contract,        # Contract object
    start='',        # Start date (YYYY-MM-DD)
    end='',          # End date (YYYY-MM-DD)
    timeout=30000,   # Timeout in milliseconds
    cb=None          # Optional callback function
)
```

**KBar Record Fields:**
- Timestamp
- Open price
- High price
- Low price
- Close price
- Volume (aggregated for the period)

**Example:**
```python
kbars = api.kbars(
    contract=api.Contracts.Stocks['2330'],
    start='2025-12-01',
    end='2025-12-23'
)
```

### Historical Data Coverage

- **Stocks**: Data available from **March 2, 2020** onward
- **Futures**: Data available from **March 22, 2020** onward

### Continuous Futures Contracts

For expired futures contracts, use continuous contracts:
- **R1 Contract**: First continuous contract (automatically rolls on delivery)
- **R2 Contract**: Second continuous contract

These contracts enable historical data retrieval across contract expirations without manual rollover.

---

## Snapshot Data

### API Method

Retrieve current market snapshots using `api.snapshots()`.

**Method Signature:**
```python
api.snapshots(
    contracts: List[Union[Stock, Future, Option, Index]],
    timeout: int = 30000,
    cb: Callable = None
) -> List[Snapshot]
```

**Parameters:**
- `contracts`: List of contract objects (maximum 500 per request)
- `timeout`: Response timeout in milliseconds (default: 30000)
- `cb`: Optional callback function for asynchronous processing

### Snapshot Data Structure

Each snapshot contains **21 attributes**:

**Price Information:**
- `ts`: Timestamp
- `code`: Stock/contract code
- `exchange`: Exchange identifier
- `open`: Opening price
- `high`: Highest price
- `low`: Lowest price
- `close`: Current/closing price
- `avg_price`: Average price

**Change Metrics:**
- `change_price`: Price change from previous close
- `change_rate`: Percentage change
- `change_type`: Up/Down/Unchanged/Limit Up/Limit Down

**Volume Data:**
- `volume`: Current trade volume
- `total_volume`: Total volume
- `yesterday_volume`: Previous day's volume
- `volume_ratio`: Volume comparison ratio

**Trading Activity:**
- `buy_price`: Best bid price
- `buy_volume`: Best bid volume
- `sell_price`: Best ask price
- `sell_volume`: Best ask volume
- `tick_type`: Buy/Sell indicator
- `amount`: Trade amount
- `total_amount`: Total trade amount

---

## Code Examples

### Example 1: Subscribe to Real-time Tick Data

```python
import shioaji as sj

# Initialize API
api = sj.Shioaji()
api.login(person_id='YOUR_ID', passwd='YOUR_PASSWORD')

# Get contract
contract = api.Contracts.Stocks['2330']  # TSMC

# Define callback
@api.on_tick_stk_v1()
def tick_callback(exchange, tick):
    print(f"[{tick.datetime}] {tick.code}")
    print(f"  Price: {tick.close}, Volume: {tick.volume}")
    print(f"  Change: {tick.price_chg} ({tick.pct_chg}%)")
    print(f"  Tick Type: {'External' if tick.tick_type == 1 else 'Internal'}")

# Subscribe
api.quote.subscribe(contract, quote_type=sj.constant.QuoteType.Tick, version='v1')
```

### Example 2: Subscribe to BidAsk Depth

```python
# Define callback for bid-ask data
@api.on_bidask_stk_v1()
def bidask_callback(exchange, bidask):
    print(f"[{bidask.datetime}] {bidask.code}")
    print("  Bid Depth:")
    for i in range(5):
        print(f"    L{i+1}: {bidask.bid_price[i]} x {bidask.bid_volume[i]}")
    print("  Ask Depth:")
    for i in range(5):
        print(f"    L{i+1}: {bidask.ask_price[i]} x {bidask.ask_volume[i]}")

# Subscribe
api.quote.subscribe(
    contract,
    quote_type=sj.constant.QuoteType.BidAsk,
    version='v1'
)
```

### Example 3: Get Historical Ticks for a Specific Date

```python
# Get all ticks for a trading day
contract = api.Contracts.Stocks['2330']
ticks = api.ticks(contract, date='2025-12-20')

# Process ticks
for tick in ticks:
    print(f"{tick['datetime']} - Price: {tick['close']}, Volume: {tick['volume']}")
```

### Example 4: Get Last N Ticks

```python
# Get the most recent 100 ticks
contract = api.Contracts.Stocks['2330']
ticks = api.ticks(contract, last_cnt=100)

print(f"Retrieved {len(ticks)} ticks")
for tick in ticks[-10:]:  # Show last 10
    print(f"{tick['datetime']} - {tick['close']}")
```

### Example 5: Get Historical KBar Data

```python
# Get daily kbars for the past month
contract = api.Contracts.Stocks['2330']
kbars = api.kbars(
    contract=contract,
    start='2025-11-23',
    end='2025-12-23'
)

# Process kbars
for kbar in kbars:
    print(f"{kbar['ts']} - O:{kbar['Open']} H:{kbar['High']} "
          f"L:{kbar['Low']} C:{kbar['Close']} V:{kbar['Volume']}")
```

### Example 6: Get Snapshots for Multiple Stocks

```python
import pandas as pd

# Get contracts
contracts = [
    api.Contracts.Stocks['2330'],  # TSMC
    api.Contracts.Stocks['2317'],  # Hon Hai
    api.Contracts.Stocks['2454'],  # MediaTek
]

# Get snapshots
snapshots = api.snapshots(contracts)

# Convert to DataFrame for analysis
df = pd.DataFrame([s.__dict__ for s in snapshots])
print(df[['code', 'close', 'change_price', 'change_rate', 'total_volume']])
```

### Example 7: Subscribe to Quote (Tick + BidAsk Combined)

```python
@api.on_quote_stk_v1()
def quote_callback(exchange, quote):
    print(f"[{quote.datetime}] {quote.code}")
    print(f"  Last: {quote.close}, Volume: {quote.volume}")
    print(f"  Best Bid: {quote.bid_price[0]} x {quote.bid_volume[0]}")
    print(f"  Best Ask: {quote.ask_price[0]} x {quote.ask_volume[0]}")
    print(f"  Available for Shorting: {quote.avail_borrowing}")

# Subscribe to Quote (comprehensive data)
api.quote.subscribe(
    contract,
    quote_type=sj.constant.QuoteType.Quote,
    version='v1'
)
```

### Example 8: Time Range Query for Ticks

```python
# Get ticks for morning session only
contract = api.Contracts.Stocks['2330']
morning_ticks = api.ticks(
    contract,
    date='2025-12-20',
    time_start='09:00:00',
    time_end='12:00:00'
)

print(f"Morning session: {len(morning_ticks)} ticks")

# Calculate VWAP for morning session
total_amount = sum(tick['amount'] for tick in morning_ticks)
total_volume = sum(tick['volume'] for tick in morning_ticks)
vwap = total_amount / total_volume if total_volume > 0 else 0
print(f"Morning VWAP: {vwap:.2f}")
```

### Example 9: Unsubscribe from Quote

```python
# Unsubscribe from a contract
api.quote.unsubscribe(
    contract,
    quote_type=sj.constant.QuoteType.Tick,
    version='v1'
)
```

### Example 10: Handle Odd-lot Trading Data

```python
# Subscribe to intraday odd-lot data (盤中零股)
api.quote.subscribe(
    contract,
    quote_type=sj.constant.QuoteType.Tick,
    intraday_odd=True,
    version='v1'
)
```

---

## Best Practices

### Performance Optimization

1. **Use appropriate quote types**: Subscribe only to needed data (Tick/BidAsk/Quote)
2. **Batch snapshot requests**: Query up to 500 contracts per request
3. **Use callbacks efficiently**: Avoid heavy processing in callbacks
4. **Time range queries**: Limit historical data requests to specific time windows

### Data Management

1. **Version control**: Use `v1` for latest data format
2. **Error handling**: Implement timeout and error handling for API calls
3. **Rate limiting**: Be aware of API rate limits
4. **Data storage**: Store historical data locally to minimize API calls

### Common Patterns

1. **Real-time monitoring**: Use Tick subscription for price updates
2. **Order book analysis**: Use BidAsk subscription for depth analysis
3. **Backtesting**: Use historical ticks/kbars for strategy testing
4. **Multi-symbol tracking**: Use snapshots for portfolio monitoring

---

## Additional Resources

- **Official Documentation**: https://sinotrade.github.io/
- **GitHub Repository**: https://github.com/Sinotrade/Shioaji
- **PyPI Package**: https://pypi.org/project/shioaji/
- **Quick Start Guide**: https://sinotrade.github.io/quickstart/

---

**Notes:**
- Historical data available from March 2, 2020 (stocks) and March 22, 2020 (futures)
- Maximum 500 contracts per snapshot request
- Default timeout is 30 seconds (30000ms)
- Quote version `v1` is recommended for latest features
- All timestamps are in Taiwan timezone (UTC+8)
