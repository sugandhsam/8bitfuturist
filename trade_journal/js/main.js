// Data storage
let trades = JSON.parse(localStorage.getItem('trades')) || [];
let traderNameSaved = localStorage.getItem('traderName') || '';

// Format currency amount (always use 2 decimal places with $)
function formatCurrencyAmount(amount) {
    return Math.abs(amount).toFixed(2);
}

// Initialize app
function init() {
    updateDateTime();
    loadTraderName();
    renderTrades();
    updateStatistics();
    setupEventListeners();

    // Set current time as default
    const now = new Date();
    const timeInput = document.getElementById('timeInput');
    if (timeInput) {
        timeInput.value = now.toTimeString().slice(0, 5);
    }
}

// Date/Time functions
function updateDateTime() {
    const now = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('currentDate').textContent = dateString;
    document.getElementById('currentTime').textContent = timeString;
}

// Trader name function
function loadTraderName() {
    document.getElementById('traderName').value = traderNameSaved;
}

function saveTraderName() {
    const name = document.getElementById('traderName').value.trim();

    if (name && name !== traderNameSaved) {
        localStorage.setItem('traderName', name);
        traderNameSaved = name;
        showToast('Name saved successfully!', 'success');
    } else if (!name) {
        showToast('Please enter a valid name', 'error');
    } else {
        showToast('No changes to save', 'error');
    }
}

// Trade functions
function addTrade() {
    const time = document.getElementById('timeInput').value;
    const instrument = document.getElementById('instrumentInput').value.trim();
    const position = document.getElementById('positionInput').value;
    const quantity = parseInt(document.getElementById('quantityInput').value);
    const timeFrame = document.getElementById('timeFrameInput').value;
    const tickValue = parseInt(document.getElementById('tickValueInput').value);
    const entry = parseFloat(document.getElementById('entryInput').value);
    const exit = parseFloat(document.getElementById('exitInput').value);

    // Validation
    if (!time || !instrument || !position || !quantity || !timeFrame || !tickValue || !entry || !exit) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (entry <= 0 || exit <= 0) {
        showToast('Entry and exit prices must be positive', 'error');
        return;
    }

    if (quantity <= 0) {
        showToast('Quantity must be a positive whole number', 'error');
        return;
    }

    if (tickValue <= 0) {
        showToast('Tick value must be a positive whole number', 'error');
        return;
    }

    // Calculate P/L using new formula: PnL = TickValue * Quantity * (Entry-Exit for Long, Exit-Entry for Short)
    const pl = calculatePL(position, entry, exit, quantity, tickValue);
    const plPercentNum = parseFloat(((Math.abs(exit - entry) / entry) * 100).toFixed(2));

    const trade = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        time,
        instrument,
        position,
        quantity,
        timeFrame,
        tickValue,
        entry,
        exit,
        pl,
        plPercent: plPercentNum
    };

    trades.push(trade);
    saveTrades();
    clearInputs();
    renderTrades();
    updateStatistics();
    showToast('Trade added successfully!', 'success');
}

function calculatePL(position, entry, exit, quantity, tickValue) {
    let priceDifference;

    if (position === 'Long') {
        priceDifference = exit - entry;
    } else { // Short
        priceDifference = entry - exit;
    }

    return tickValue * quantity * priceDifference;
}

function deleteTrade(tradeId) {
    if (confirm('Are you sure you want to delete this trade?')) {
        trades = trades.filter(trade => trade.id !== parseInt(tradeId));
        saveTrades();
        renderTrades();
        updateStatistics();
        showToast('Trade deleted successfully!', 'success');
    }
}

function clearInputs() {
    document.getElementById('instrumentInput').value = '';
    document.getElementById('positionInput').value = '';
    document.getElementById('quantityInput').value = '';
    document.getElementById('timeFrameInput').value = '';
    document.getElementById('tickValueInput').value = '';
    document.getElementById('entryInput').value = '';
    document.getElementById('exitInput').value = '';

    // Reset time to current
    const now = new Date();
    document.getElementById('timeInput').value = now.toTimeString().slice(0, 5);

    // Reset P/L preview
    document.getElementById('plPreview').className = 'text-sm text-gray-500';
    document.getElementById('plPreview').textContent = 'Live calculation';
}

function renderTrades() {
    const tbody = document.getElementById('tradesTable');
    const inputRow = tbody.querySelector('.input-row');

    // Clear existing trade rows
    const tradeRows = tbody.querySelectorAll('tr:not(.input-row)');
    tradeRows.forEach(row => row.remove());

    // Filter trades
    const searchTerm = document.getElementById('searchFilter').value.toLowerCase();
    const filteredTrades = trades.filter(trade =>
        trade.instrument.toLowerCase().includes(searchTerm) ||
        (trade.position || trade.type || '').toLowerCase().includes(searchTerm) ||
        trade.timeFrame.toLowerCase().includes(searchTerm)
    );

    // Add trade rows
    filteredTrades.forEach(trade => {
        const row = document.createElement('tr');
        row.className = 'table-row';

        const plClass = trade.pl >= 0 ? 'profit' : 'loss';
        const plSign = trade.pl >= 0 ? '+' : '';
        const position = trade.position || trade.type || 'N/A'; // Backward compatibility
        const quantity = trade.quantity || 'N/A';
        const tickValue = trade.tickValue || 'N/A';

        row.innerHTML = `
            <td class="table-cell">
                <span class="font-medium">${trade.instrument}</span>
            </td>
            <td class="table-cell">
                <span class="badge ${position === 'Long' ? 'badge-success' : 'badge-destructive'}">${position}</span>
            </td>
            <td class="table-cell font-mono text-sm">${quantity}</td>
            <td class="table-cell font-mono text-sm">${trade.timeFrame}</td>
            <td class="table-cell font-mono text-sm">${tickValue}</td>
            <td class="table-cell font-mono">${formatCurrencyAmount(trade.entry)}</td>
            <td class="table-cell font-mono">${formatCurrencyAmount(trade.exit)}</td>
            <td class="table-cell">
                <div class="${plClass}">
                    <div class="font-medium">${plSign}$${formatCurrencyAmount(trade.pl)}</div>
                    <div class="text-xs opacity-75">${plSign}${Math.abs(trade.plPercent).toFixed(2)}%</div>
                </div>
            </td>
            <td class="table-cell font-mono text-sm">${trade.time}</td>
            <td class="table-cell">
                <button data-id="${trade.id}" class="delete-trade-btn button button-destructive button-sm">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });

    // Show empty state if no trades
    if (filteredTrades.length === 0 && trades.length > 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="10" class="table-cell text-center py-8 text-gray-500">
                <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <p>No trades match your search criteria</p>
                </div>
            </td>
        `;
        tbody.appendChild(emptyRow);
    } else if (trades.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="10" class="table-cell text-center py-8 text-gray-500">
                <div class="flex flex-col items-center">
                    <svg class="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    <p class="text-lg font-medium mb-2">No trades yet</p>
                    <p class="text-sm">Add your first trade using the form above</p>
                </div>
            </td>
        `;
        tbody.appendChild(emptyRow);
    }
}

function updateStatistics() {
    const totalTrades = trades.length;
    const totalPL = trades.reduce((sum, trade) => sum + trade.pl, 0);
    const winningTrades = trades.filter(trade => trade.pl > 0).length;
    const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : 0;

    // Calculate average risk/reward
    const winners = trades.filter(trade => trade.pl > 0);
    const losers = trades.filter(trade => trade.pl < 0);
    const avgWin = winners.length > 0 ? winners.reduce((sum, trade) => sum + trade.pl, 0) / winners.length : 0;
    const avgLoss = losers.length > 0 ? Math.abs(losers.reduce((sum, trade) => sum + trade.pl, 0) / losers.length) : 0;
    const avgRR = avgLoss > 0 ? `1:${(avgWin / avgLoss).toFixed(1)}` : '1:1';

    // Update total P/L with color and dollar symbol
    const totalPLElement = document.getElementById('totalPL');
    const plSign = totalPL >= 0 ? '+' : '';
    totalPLElement.textContent = `${plSign}$${formatCurrencyAmount(totalPL)}`;
    totalPLElement.className = `text-2xl font-bold ${totalPL >= 0 ? 'profit' : 'loss'}`;

    document.getElementById('totalTrades').textContent = totalTrades;
    document.getElementById('winRate').textContent = `${winRate}%`;
    document.getElementById('avgRR').textContent = avgRR;
}

function saveTrades() {
    localStorage.setItem('trades', JSON.stringify(trades));
}

function exportToCSV() {
    if (trades.length === 0) {
        showToast('No trades to export', 'error');
        return;
    }

    const headers = ['Date', 'Instrument', 'Position', 'Quantity', 'Time Frame', 'Tick Value', 'Entry', 'Exit', 'Profit/Loss', 'P/L %', 'Time'];
    const csvContent = [
        headers.join(','),
        ...trades.map(trade => [
            trade.date || new Date().toISOString().split('T')[0],
            trade.instrument,
            trade.position || trade.type || 'N/A',
            trade.quantity || 'N/A',
            trade.timeFrame,
            trade.tickValue || 'N/A',
            trade.entry,
            trade.exit,
            trade.pl.toFixed(2),
            parseFloat(trade.plPercent).toFixed(2),
            trade.time
        ].join(','))
    ].join('\n');

    try {
        const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trade_journal_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast('Trade journal exported as TXT!', 'success');
    } catch (error) {
        showToast('Error exporting file', 'error');
    }
}

function generateDailyReport() {
    if (trades.length === 0) {
        showToast('No trades found to generate report', 'error');
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const todayTrades = trades.filter(trade => trade.date === today);

    const totalPL = trades.reduce((sum, trade) => sum + trade.pl, 0);
    const winningTrades = trades.filter(trade => trade.pl > 0).length;
    const losingTrades = trades.filter(trade => trade.pl <= 0).length;
    const winRate = trades.length > 0 ? ((winningTrades / trades.length) * 100).toFixed(1) : 0;

    const bestTrade = trades.length > 0 ? Math.max(...trades.map(t => t.pl)).toFixed(2) : '0.00';
    const worstTrade = trades.length > 0 ? Math.min(...trades.map(t => t.pl)).toFixed(2) : '0.00';

    const report = `📊 TRADING PERFORMANCE REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 OVERALL STATISTICS
• Total Trades: ${trades.length}
• Total P/L: $${totalPL.toFixed(2)}
• Win Rate: ${winRate}%
• Winning Trades: ${winningTrades}
• Losing Trades: ${losingTrades}

🎯 PERFORMANCE HIGHLIGHTS
• Best Trade: $${bestTrade}
• Worst Trade: $${worstTrade}
• Today's Trades: ${todayTrades.length}

Generated on ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`;

    alert(report);
}

function clearAllTrades() {
    if (trades.length === 0) {
        showToast('No trades to clear', 'error');
        return;
    }

    if (confirm('⚠️ Are you sure you want to delete ALL trades?\n\nThis action cannot be undone and will permanently remove all your trading data.')) {
        trades = [];
        saveTrades();
        renderTrades();
        updateStatistics();
        showToast('All trades have been cleared', 'success');
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    // Set message
    toastMessage.textContent = message;

    // Set icon based on type
    if (type === 'success') {
        toast.className = 'toast toast-success';
        toastIcon.innerHTML = `
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        `;
    } else {
        toast.className = 'toast toast-error';
        toastIcon.innerHTML = `
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        `;
    }

    // Show toast
    toast.style.display = 'block';

    // Auto hide after 4 seconds
    setTimeout(() => {
        toast.style.display = 'none';
    }, 4000);
}

function updatePLPreview() {
    const position = document.getElementById('positionInput').value;
    const quantity = parseInt(document.getElementById('quantityInput').value);
    const tickValue = parseInt(document.getElementById('tickValueInput').value);
    const entry = parseFloat(document.getElementById('entryInput').value);
    const exit = parseFloat(document.getElementById('exitInput').value);

    if (position && quantity && tickValue && entry && exit && entry > 0 && exit > 0 && quantity > 0 && tickValue > 0) {
        const pl = calculatePL(position, entry, exit, quantity, tickValue);
        const plPercent = ((Math.abs(exit - entry) / entry) * 100).toFixed(2);
        const plPercentSigned = position === 'Long' ? (exit > entry ? plPercent : -plPercent) : (exit < entry ? plPercent : -plPercent);
        const plSign = pl >= 0 ? '+' : '';
        const plClass = pl >= 0 ? 'profit' : 'loss';

        document.getElementById('plPreview').innerHTML = `
            <div class="${plClass}">
                <div class="font-medium text-sm">${plSign}$${formatCurrencyAmount(pl)}</div>
                <div class="text-xs opacity-75">${plSign}${Math.abs(plPercentSigned)}%</div>
            </div>
        `;
    } else {
        document.getElementById('plPreview').innerHTML = '<span class="text-sm text-gray-500">Live calculation</span>';
    }
}

function setupEventListeners() {
    // Save name button
    const saveNameBtn = document.getElementById('saveName');
    if (saveNameBtn) {
        saveNameBtn.addEventListener('click', saveTraderName);
    }

    // Add trade button
    const addTradeBtn = document.getElementById('addTrade');
    if (addTradeBtn) {
        addTradeBtn.addEventListener('click', addTrade);
    }

    // Export CSV button
    const exportCSVBtn = document.getElementById('exportCSV');
    if (exportCSVBtn) {
        exportCSVBtn.addEventListener('click', exportToCSV);
    }

    // Generate report button
    const generateReportBtn = document.getElementById('generateReport');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateDailyReport);
    }

    // Clear all button
    const clearAllBtn = document.getElementById('clearAll');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllTrades);
    }

    // Search filter
    document.getElementById('searchFilter').addEventListener('input', renderTrades);

    // P/L preview updates
    ['positionInput', 'quantityInput', 'tickValueInput', 'entryInput', 'exitInput'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updatePLPreview);
        }
    });

    // Event delegation for delete buttons
    const tradesTable = document.getElementById('tradesTable');
    if (tradesTable) {
        tradesTable.addEventListener('click', (e) => {
            if (e.target.closest('.delete-trade-btn')) {
                const button = e.target.closest('.delete-trade-btn');
                const tradeId = button.dataset.id;
                deleteTrade(tradeId);
            }
        });
    }
}

// Start the app once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    setInterval(updateDateTime, 1000);

    // Enter key to add trade
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.closest('.input-row')) {
            e.preventDefault();
            addTrade();
        }
    });

    // Escape key to clear inputs
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clearInputs();
        }
    });
});
