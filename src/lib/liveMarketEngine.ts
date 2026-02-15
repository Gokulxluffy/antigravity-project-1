// ============================================================
// Live Market Intelligence Engine (Include 2)
// Simulated real-time financial nervous system
// ============================================================
import { LiveMarketTick, LiveIndexData } from './types';
import { allStocks } from './stockData';

// ── Simulated Tick Generation ──
function randomWalk(base: number, volatility: number = 0.002): number {
    const change = (Math.random() - 0.48) * volatility * base; // slight upward bias
    return Math.round((base + change) * 100) / 100;
}

// ── Generate Live Stock Tick ──
export function generateTick(symbol: string, lastPrice: number): LiveMarketTick {
    const newPrice = randomWalk(lastPrice, 0.003);
    const change = Math.round((newPrice - lastPrice) * 100) / 100;
    const changePercent = Math.round((change / lastPrice) * 10000) / 100;
    const spread = lastPrice * 0.001;

    return {
        symbol,
        price: newPrice,
        change,
        changePercent,
        volume: Math.round(Math.random() * 500000 + 100000),
        timestamp: Date.now(),
        bid: Math.round((newPrice - spread / 2) * 100) / 100,
        ask: Math.round((newPrice + spread / 2) * 100) / 100,
        dayHigh: Math.round((newPrice * (1 + Math.random() * 0.02)) * 100) / 100,
        dayLow: Math.round((newPrice * (1 - Math.random() * 0.02)) * 100) / 100,
    };
}

// ── Generate Live Index Data ──
const INDEX_BASE: Record<string, number> = {
    'NIFTY 50': 22450,
    'SENSEX': 73800,
    'NIFTY BANK': 47200,
    'NIFTY IT': 34500,
    'NIFTY PHARMA': 16800,
    'NIFTY AUTO': 19200,
    'NIFTY METAL': 8400,
    'NIFTY ENERGY': 37500,
};

export function generateIndexTick(name: string, lastValue?: number): LiveIndexData {
    const base = lastValue || INDEX_BASE[name] || 20000;
    const newValue = randomWalk(base, 0.001);
    return {
        name,
        value: Math.round(newValue * 100) / 100,
        change: Math.round((newValue - base) * 100) / 100,
        changePercent: Math.round(((newValue - base) / base) * 10000) / 100,
        timestamp: Date.now(),
    };
}

// ── Generate All Index Ticks ──
export function generateAllIndexTicks(lastValues?: Record<string, number>): LiveIndexData[] {
    return Object.keys(INDEX_BASE).map(name => generateIndexTick(name, lastValues?.[name]));
}

// ── Generate All Stock Ticks ──
export function generateAllStockTicks(lastPrices?: Record<string, number>): LiveMarketTick[] {
    return allStocks.map(s => {
        const lastPrice = lastPrices?.[s.company.symbol] || s.price.currentPrice;
        return generateTick(s.company.symbol, lastPrice);
    });
}

// ── Live Portfolio Valuation ──
export function calculateLivePortfolioValue(
    holdings: Array<{ symbol: string; quantity: number }>,
    currentPrices: Record<string, number>
): { totalValue: number; dayGainLoss: number; dayGainLossPercent: number; holdingValues: Array<{ symbol: string; value: number; change: number }> } {
    let totalValue = 0;
    let totalCostBasis = 0;
    const holdingValues: Array<{ symbol: string; value: number; change: number }> = [];

    holdings.forEach(h => {
        const currentPrice = currentPrices[h.symbol] || 0;
        const stock = allStocks.find(s => s.company.symbol === h.symbol);
        const basePrice = stock?.price.currentPrice || currentPrice;
        const value = currentPrice * h.quantity;
        const costBasis = basePrice * h.quantity;
        totalValue += value;
        totalCostBasis += costBasis;
        holdingValues.push({
            symbol: h.symbol,
            value,
            change: Math.round(((currentPrice - basePrice) / basePrice) * 10000) / 100,
        });
    });

    const dayGainLoss = Math.round((totalValue - totalCostBasis) * 100) / 100;
    const dayGainLossPercent = totalCostBasis > 0 ? Math.round((dayGainLoss / totalCostBasis) * 10000) / 100 : 0;

    return { totalValue, dayGainLoss, dayGainLossPercent, holdingValues };
}

// ── Market Breadth ──
export function calculateMarketBreadth(ticks: LiveMarketTick[]): { advances: number; declines: number; unchanged: number } {
    let advances = 0, declines = 0, unchanged = 0;
    ticks.forEach(t => {
        if (t.change > 0) advances++;
        else if (t.change < 0) declines++;
        else unchanged++;
    });
    return { advances, declines, unchanged };
}

// ── Streaming Simulation (returns cleanup function) ──
export function startTickStream(
    onStockTick: (tick: LiveMarketTick) => void,
    onIndexTick: (tick: LiveIndexData) => void,
    intervalMs: number = 2000
): () => void {
    const lastPrices: Record<string, number> = {};
    const lastIndexValues: Record<string, number> = {};

    // Initialize
    allStocks.forEach(s => { lastPrices[s.company.symbol] = s.price.currentPrice; });
    Object.entries(INDEX_BASE).forEach(([name, value]) => { lastIndexValues[name] = value; });

    const stockInterval = setInterval(() => {
        // Update ~5 random stocks per tick
        const randomStocks = allStocks
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.min(5, allStocks.length));

        randomStocks.forEach(s => {
            const tick = generateTick(s.company.symbol, lastPrices[s.company.symbol]);
            lastPrices[s.company.symbol] = tick.price;
            onStockTick(tick);
        });
    }, intervalMs);

    const indexInterval = setInterval(() => {
        Object.keys(INDEX_BASE).forEach(name => {
            const tick = generateIndexTick(name, lastIndexValues[name]);
            lastIndexValues[name] = tick.value;
            onIndexTick(tick);
        });
    }, intervalMs * 1.5);

    return () => {
        clearInterval(stockInterval);
        clearInterval(indexInterval);
    };
}

// ── Top Gainers/Losers ──
export function getTopMovers(ticks: LiveMarketTick[], count: number = 5) {
    const sorted = [...ticks].sort((a, b) => b.changePercent - a.changePercent);
    return {
        gainers: sorted.slice(0, count),
        losers: sorted.slice(-count).reverse(),
    };
}
