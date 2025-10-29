# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Trading Apps Suite** - A collection of professional trading applications including:
1. **Trade Journal** - Track trading performance with P/L calculations
2. **8BF Prop Bunker** - Risk-to-reward analysis for prop firm challenges

Both apps are lightweight, single-page applications with no build tools, no npm dependencies, and no backend server. All data persists in browser localStorage.

## Project Structure

```
/
├── index.html                          # Prop Bunker (default landing page)
├── prop.html                           # Alternative Prop Bunker version
├── trade_journal.html                  # Standalone Trade Journal version
├── trade_journal/
│   ├── index.html                      # Trade Journal main app
│   ├── css/
│   │   └── styles.css                  # Shared component styles
│   ├── js/
│   │   └── main.js                     # Trade Journal functionality
│   └── README.md                       # Trade Journal documentation
├── CLAUDE.md                           # This file
└── .gitignore                          # Git ignore rules
```

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: Tailwind CSS (CDN), CSS Custom Properties
- **Storage**: Browser localStorage (no backend)
- **No dependencies**: Zero npm packages, no build process required

## Getting Started

### Running Locally

The applications require no build process. To run:

1. Open `index.html` (Prop Bunker) directly in a web browser
2. Open `trade_journal/index.html` (Trade Journal) directly in a web browser
3. Applications load immediately and are fully functional
4. All data persists in localStorage

### Using HTTP Server

For local development:

```bash
cd /path/to/webapps
python3 -m http.server 8000
```

Then access:
- **Prop Bunker**: http://localhost:8000
- **Trade Journal**: http://localhost:8000/trade_journal/

## Architecture Overview

### Shared Header Design

Both apps use a matching gradient header with navigation:
- Background: Linear gradient (blue to dark)
- Navigation links in top right
- Current date/time display (Trade Journal only)
- Responsive design for mobile

### Trade Journal Architecture

**Modular JavaScript Functions**:
- `init()` - Application initialization
- `addTrade()` - Add new trade with validation
- `calculatePL()` - P/L calculation (Tick Value × Quantity × Price Difference)
- `renderTrades()` - Dynamic table rendering with real-time updates
- `updateStatistics()` - Dashboard statistics calculation
- `exportToCSV()` - File export functionality
- `generateDailyReport()` - Performance reporting
- `showToast()` - Toast notification system
- `updatePLPreview()` - Live calculation preview as user types

**Event-Driven Design**:
- Event delegation on delete buttons
- Input event listeners for live P/L preview
- Real-time search and filter functionality
- Keyboard shortcuts (Enter to submit, Escape to clear)

### 8BF Prop Bunker Architecture

**Calculation Functions**:
- NQ futures contract calculations (20-point value)
- Risk-to-reward analysis
- Drawdown analysis
- Win rate calculations
- Scenario generation for different risk levels

**Interactive Elements**:
- Slider controls with dual input (slider + text box)
- Tab switching (Trailing vs EOD drawdown)
- Dynamic prop firm configuration dropdown
- Advanced mode for scenario analysis

## Data Model

### Trade Journal Trade Object

```javascript
{
  id: timestamp,
  date: "YYYY-MM-DD",
  time: "HH:MM",
  instrument: "AAPL",
  position: "Long" | "Short",
  quantity: number,
  timeFrame: "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1D",
  tickValue: number,
  entry: number,
  exit: number,
  pl: number,
  plPercent: number
}
```

### LocalStorage Keys

**Trade Journal**:
- `trades` - JSON array of all trade objects
- `traderName` - User's trader name string

## P/L Calculation Formula

**Formula**: `P/L = Tick Value × Quantity × Price Difference`

- **Long Position**: `Price Difference = Exit Price - Entry Price`
- **Short Position**: `Price Difference = Entry Price - Exit Price`

Example:
- AAPL Long, Qty: 100, Tick Value: 1, Entry: $140, Exit: $150
- P/L = 1 × 100 × (150 - 140) = $1,000 (profit)

## Common Development Tasks

### Adding a New Feature

1. Add HTML structure in the appropriate `index.html`
2. Add styling to `css/styles.css` (use existing component classes where possible)
3. Add JavaScript logic in `js/main.js` as a new function
4. Call the function from appropriate event listeners or initialization
5. Test in browser by opening the HTML file directly

### Modifying P/L Calculation (Trade Journal)

The calculation logic is in `calculatePL()` function in `js/main.js`:37.

This function is called:
- When user inputs data (real-time preview via `updatePLPreview()`)
- When rendering the trades table
- When calculating dashboard statistics

### Adding/Modifying Statistics (Trade Journal)

Dashboard statistics are calculated in `updateStatistics()` function:
- Total P/L: Sum of all trade P/L values
- Total Trades: Count of trades in localStorage
- Win Rate: (Winning trades / Total trades) × 100
- Average R:R: Average risk-to-reward ratio

### Exporting Data (Trade Journal)

CSV export is handled by `exportToCSV()` function:
1. Formats trade data as CSV
2. Creates a Blob and download link
3. Triggers browser download with filename `trade_journal_YYYY-MM-DD.txt`

### Testing

Since there's no automated test setup, test manually:
1. Open the HTML file directly or via HTTP server
2. Test the specific feature
3. Verify localStorage persistence by refreshing the page
4. Check responsive design on mobile devices

## Important Implementation Details

### Currency Formatting (Trade Journal)

All monetary values use USD format with 2 decimal places:
```javascript
function formatCurrencyAmount(amount) {
    return Math.abs(amount).toFixed(2);
}
// Usage: $1,250.50
```

### Input Validation (Trade Journal)

Key validations in `addTrade()`:
- Quantity and Tick Value must be whole numbers ≥ 1
- Entry and Exit prices must be valid numbers > 0
- Instrument, Position, and Timeframe required
- Empty fields show validation errors via toast

### Real-Time P/L Preview (Trade Journal)

The `updatePLPreview()` function:
- Triggers on input event for Entry/Exit/Position/Quantity/Tick Value
- Updates the preview without saving
- Shows live calculation as user types
- Displays in green for profits, red for losses

### Keyboard Shortcuts (Trade Journal)

- **Enter**: Submit new trade (when focused on input row)
- **Escape**: Clear input fields

### Component-Based CSS

Reusable CSS classes:
- `.button`, `.button-primary`, `.button-secondary`, `.button-destructive` - Button styles
- `.card`, `.card-content`, `.card-header` - Container styles
- `.badge`, `.badge-success`, `.badge-destructive` - Label styles
- `.input`, `.select` - Form input styles
- `.stat-card` - Statistics display card
- `.table`, `.table-row`, `.table-cell`, `.table-header` - Table styles

## Browser Compatibility

Target modern browsers with localStorage support:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Design System

**Color Palette** (CSS custom properties):
- Primary: #1e3a8a (blue)
- Success: #16a34a (green) - for profits
- Destructive: #ef4444 (red) - for losses
- Neutral: Grays for text and borders

**Typography**:
- Font Family: Inter (Google Fonts)
- Base font size: 1rem (16px)
- Line height: 1.5

**Spacing**: 4px-based grid system for consistent spacing

**Effects**:
- Glassmorphism: Semi-transparent backgrounds with blur
- Shadows: Subtle shadows for depth
- Transitions: Smooth animations (200-300ms)
- Gradients: Linear gradients for headers and backgrounds

## File Size Considerations

Keep files lean and performant:
- `index.html`: ~2KB (Prop Bunker with embedded CSS/JS)
- `trade_journal/index.html`: ~20KB (Trade Journal with embedded CSS/JS)
- `trade_journal/css/styles.css`: ~6KB
- `trade_journal/js/main.js`: ~15KB

Avoid:
- Large external dependencies
- Complex build processes
- External API calls (unless necessary)

## Git Workflow

The project is initialized with git and connected to GitHub:

```bash
# Check remote
git remote -v

# View status
git status

# Commit changes
git add .
git commit -m "Your message"

# Push to GitHub
git push origin main
```

## Future Enhancements

Potential improvements without adding complexity:
- Dark mode toggle (CSS variables)
- Advanced filtering and sorting (JavaScript)
- Chart visualizations (Chart.js via CDN)
- Mobile app wrapper (Electron or similar)
- Backend integration (add API endpoint)

## Standalone Versions

Alternative single-file versions exist:
- `trade_journal.html` - Trade Journal with all code inline
- `prop.html` - Original Prop Bunker file

These can be used as alternatives or for deployment to CDNs.
