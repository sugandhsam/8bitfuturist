# Trade Journal - Professional Trading Tracker

A clean, modern trading journal application with proper separation of concerns.

## 📁 Project Structure

```
trade_journal/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All CSS styles and custom component classes
├── js/
│   └── main.js         # All JavaScript functionality
└── README.md           # This file
```

## ✨ Features

- **Simple Dollar-Based Trading**: All amounts displayed in USD ($)
- **Advanced P/L Calculation**: Tick value and quantity-based calculations
- **Real-time P/L Preview**: Live calculation as you enter trade data
- **Professional Formatting**: Clean, consistent 2-decimal place formatting
- **Trading Statistics**: Win rate, total P/L, average R:R ratio
- **Export & Reports**: CSV export and daily performance reports
- **Search & Filter**: Find trades by instrument, position, or timeframe
- **Local Storage**: All data persists in browser localStorage
- **Flexible Instrument Entry**: Custom instrument names instead of dropdown

## 🚀 Getting Started

1. Open `index.html` in your web browser
2. Set your trader name
3. Start adding trades using the input row at the top of the table

## 🛠️ Technical Details

### CSS Architecture
- **CSS Custom Properties**: Using CSS variables for consistent theming
- **Component-based**: Reusable button, card, input, and badge classes
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Styling**: Glassmorphism effects and smooth animations

### JavaScript Architecture
- **Modular Functions**: Well-organized, single-responsibility functions
- **Data Persistence**: localStorage for client-side data storage
- **Event-driven**: Comprehensive event handling for user interactions

### Currency Format
- **Standard**: All amounts displayed in USD with 2 decimal places ($1,250.50)

## 💰 P/L Calculation Formula

The trade journal uses a sophisticated P/L calculation based on tick values and quantities:

**Formula**: `P/L = Tick Value × Quantity × Price Difference`

Where:
- **Long Position**: Price Difference = Exit Price - Entry Price
- **Short Position**: Price Difference = Entry Price - Exit Price

**Example**: 
- AAPL Long, Quantity: 100, Tick Value: 1, Entry: $140, Exit: $150
- P/L = 1 × 100 × (150 - 140) = $1,000

### Trade Entry Fields
- **Instrument**: Custom text input (e.g., AAPL, BTC/USD)
- **Position**: Long or Short
- **Quantity**: Whole numbers only (minimum 1)
- **Timeframe**: Trading timeframe (1m, 5m, 15m, etc.)
- **Tick Value**: Whole numbers only (minimum 1) - dollar value per point
- **Entry Price**: Entry price with currency symbol
- **Exit Price**: Exit price with currency symbol

## 📊 Features Breakdown

### Dashboard Statistics
- **Total P/L**: Cumulative profit/loss with dynamic currency symbol
- **Total Trades**: Number of completed trades
- **Win Rate**: Percentage of profitable trades
- **Average R:R**: Average risk-to-reward ratio

### Trade Management
- **Add Trades**: Quick entry with validation
- **Search & Filter**: Find specific trades instantly
- **Delete Trades**: Remove individual trades with confirmation
- **Clear All**: Bulk delete with warning

### Data Export
- **CSV Export**: Download trade history in spreadsheet format
- **Daily Reports**: Performance summary with key metrics

## 🔧 Development

The application is built with:
- **Vanilla JavaScript**: No frameworks, lightweight and fast
- **Tailwind CSS**: Utility-first CSS framework
- **Modern CSS**: Custom properties, flexbox, grid
- **Local Storage API**: Client-side persistence

## 📱 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎨 Design System

The application uses a consistent design system with:
- **Color Palette**: Professional blues, greens for profits, reds for losses
- **Typography**: Inter font family for modern, readable text
- **Spacing**: Consistent 4px grid system
- **Components**: Reusable UI elements with hover states

## 🔒 Data Privacy

All data is stored locally in your browser. No data is sent to external servers, ensuring complete privacy of your trading information.
