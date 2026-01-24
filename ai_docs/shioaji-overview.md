# Shioaji - Python Trading API for Taiwan Markets

**Source:** https://sinotrade.github.io/

**Official Repository:** 永豐金證券 (SinoPac Securities)

---

## Overview

Shioaji is a Python-based trading API designed for Taiwan and global financial markets. It provides a comprehensive solution for algorithmic trading, market data streaming, and portfolio management with seamless integration into the Python ecosystem.

The API allows developers to combine trading functionality with popular data science and machine learning libraries such as NumPy, pandas, PyTorch, and TensorFlow, enabling sophisticated trading model development across multiple platforms.

---

## Key Features

### 1. High Performance
- Core implementation in C++ for optimal speed
- FPGA event broker for ultra-low latency
- Efficient real-time market data processing

### 2. Simple & Accessible
- User-friendly API design for beginners
- Clean, intuitive interface
- Comprehensive documentation and examples

### 3. Fast Development
- Native Python integration
- Rapid prototyping and model development
- Seamless integration with data science tools

### 4. Cross-Platform Support
- First Python trading API in Taiwan with Linux compatibility
- Supports Windows, macOS, and Linux
- Containerized deployment options available

---

## Capabilities

### Trading Functions
- **Stock Trading**: Order placement and management for Taiwan stocks
- **Futures Trading**: Support for Taiwan futures markets
- **Options Trading**: Options contract trading capabilities
- **Order Management**: Real-time order status tracking and modification

### Market Data
- **Real-time Streaming**: Live market data feeds
- **Contract Information**: Access to complete contract specifications
- **Quote Binding Mode**: Advanced quote subscription features
- **Historical Data**: Access to historical market data

### Account Management
- **Balance Monitoring**: Real-time account balance tracking
- **Position Tracking**: Current holdings and positions
- **P&L Analysis**: Profit and loss calculations
- **Settlement Information**: Account settlement data

### Advanced Features
- **Non-blocking Operations**: Asynchronous API calls
- **Event-driven Architecture**: Callback-based event handling
- **High Test Coverage**: 99% test coverage for reliability
- **Interactive Tutorials**: Jupyter notebook examples

---

## Installation

### Method 1: pip (Recommended)
```bash
pip install shioaji
```

### Method 2: uv (Modern Package Manager)
```bash
# Install uv first
pip install uv

# Install Shioaji with uv for better performance
uv pip install shioaji
```

### Method 3: Docker
```bash
# Pull the official Docker image
docker pull sinotrade/shioaji

# Run in interactive mode
docker run -it sinotrade/shioaji

# Run with Jupyter notebook
docker run -p 8888:8888 sinotrade/shioaji jupyter notebook --ip=0.0.0.0 --allow-root
```

---

## Getting Started

### Basic Workflow

1. **Account Setup & Token Management**
   - Register for API access credentials
   - Obtain authentication tokens
   - Configure API permissions

2. **Login & Authentication**
   - Connect to the trading system
   - Authenticate with credentials
   - Establish secure session

3. **Market Data Access**
   - Subscribe to real-time quotes
   - Retrieve contract information
   - Stream market data

4. **Order Placement**
   - Create buy/sell orders for stocks
   - Place futures and options trades
   - Manage order lifecycle

5. **Account Monitoring**
   - Monitor account balance
   - Track positions and holdings
   - Analyze profit and loss

### Code Example Structure

```python
import shioaji as sj

# Initialize API
api = sj.Shioaji()

# Login (authentication required)
api.login(person_id="YOUR_ID", passwd="YOUR_PASSWORD")

# Access market data
# Place orders
# Monitor positions
# (Detailed examples available in official tutorials)
```

---

## Documentation Resources

The official documentation includes:

- **Quick Start Guide**: Step-by-step beginner tutorial
- **API Reference**: Complete function and parameter documentation
- **Interactive Notebooks**: Hands-on Jupyter examples
- **Tutorial Series**: Comprehensive learning materials
- **Best Practices**: Trading strategy implementation guides

---

## Technical Specifications

- **Language**: Python 3.7+
- **Platform Compatibility**: Windows, macOS, Linux
- **Test Coverage**: 99%
- **Architecture**: Event-driven with async support
- **Core Performance**: C++ implementation with FPGA acceleration

---

## Use Cases

- Algorithmic trading system development
- Quantitative strategy backtesting and execution
- Portfolio management automation
- Market data analysis and research
- Real-time trading signal generation
- Integration with machine learning models (PyTorch, TensorFlow)

---

## Additional Information

For detailed API documentation, tutorials, and examples, visit the official documentation site:
https://sinotrade.github.io/

For source code and issue tracking:
https://github.com/Sinotrade/Shioaji

---

*Last Updated: 2025-12-23*
*Documentation extracted from official Shioaji website*
