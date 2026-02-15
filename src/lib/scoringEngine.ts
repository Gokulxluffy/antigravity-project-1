// ============================================================
// Enhanced Scoring Engine — 8-Factor AI Scoring (Include 4)
// ============================================================
import { StockData, ScoreBreakdown, EnhancedScoreBreakdown } from './types';

function normalize(value: number, min: number, max: number, inverse = false): number {
    const clamped = Math.max(min, Math.min(max, value));
    const score = ((clamped - min) / (max - min)) * 100;
    return inverse ? 100 - score : score;
}

// ── Factor 1: Fundamental Strength ──
function calcFundamentalScore(s: StockData): { score: number; reasons: string[] } {
    const f = s.financials;
    const reasons: string[] = [];
    const roeScore = normalize(f.roe, 0, 35);
    const roceScore = normalize(f.roce, 0, 30);
    const marginScore = normalize(f.netProfitMargin, 0, 30);
    const coverageScore = normalize(Math.min(f.interestCoverage, 20), 0, 20);
    const assetTurnScore = normalize(f.assetTurnover, 0, 2);
    const score = roeScore * 0.3 + roceScore * 0.25 + marginScore * 0.2 + coverageScore * 0.15 + assetTurnScore * 0.1;
    if (f.roe > 20) reasons.push(`Strong ROE of ${f.roe.toFixed(1)}%`);
    if (f.roce > 20) reasons.push(`Excellent ROCE of ${f.roce.toFixed(1)}%`);
    if (f.netProfitMargin > 15) reasons.push(`Healthy profit margin of ${f.netProfitMargin.toFixed(1)}%`);
    if (f.interestCoverage > 5) reasons.push('Comfortable interest coverage');
    return { score: Math.round(score * 10) / 10, reasons };
}

// ── Factor 2: Growth Potential ──
function calcGrowthScore(s: StockData): { score: number; reasons: string[] } {
    const f = s.financials;
    const reasons: string[] = [];
    const revGrowth = normalize(f.revenueGrowth, -10, 40);
    const epsGrowth = normalize(f.epsGrowth, -20, 50);
    const cagrScore = normalize(f.revenueCAGR3Y, 0, 35);
    const profitCagr = normalize(f.profitCAGR3Y, 0, 40);
    const score = revGrowth * 0.25 + epsGrowth * 0.3 + cagrScore * 0.25 + profitCagr * 0.2;
    if (f.revenueGrowth > 15) reasons.push(`Strong revenue growth of ${f.revenueGrowth.toFixed(1)}%`);
    if (f.epsGrowth > 20) reasons.push(`Impressive EPS growth of ${f.epsGrowth.toFixed(1)}%`);
    if (f.revenueCAGR3Y > 20) reasons.push(`3Y revenue CAGR of ${f.revenueCAGR3Y.toFixed(1)}%`);
    return { score: Math.round(score * 10) / 10, reasons };
}

// ── Factor 3: Risk Exposure ──
function calcRiskScore(s: StockData): { score: number; reasons: string[] } {
    const f = s.financials;
    const p = s.price;
    const h = s.holdings;
    const reasons: string[] = [];
    const deScore = normalize(f.debtToEquity, 0, 3, true);
    const betaScore = normalize(p.beta, 0, 2, true);
    const promoterScore = normalize(h.promoterHolding, 0, 75);
    const pledgeScore = normalize(h.pledgedPercentage, 0, 30, true);
    const fiiScore = normalize(h.fiiHolding, 0, 50);
    const score = deScore * 0.25 + betaScore * 0.2 + promoterScore * 0.25 + pledgeScore * 0.15 + fiiScore * 0.15;
    if (f.debtToEquity < 0.5) reasons.push('Low debt-to-equity ratio');
    if (h.promoterHolding > 50) reasons.push(`High promoter holding of ${h.promoterHolding}%`);
    if (h.pledgedPercentage === 0) reasons.push('Zero pledged shares');
    if (p.beta < 1) reasons.push('Lower market volatility');
    return { score: Math.round(score * 10) / 10, reasons };
}

// ── Factor 4: Valuation ──
function calcValuationScore(s: StockData): { score: number; reasons: string[] } {
    const p = s.price;
    const reasons: string[] = [];
    const peScore = normalize(p.pe, 5, 100, true);
    const pbScore = normalize(p.pb, 0.5, 20, true);
    const pegScore = normalize(p.pegRatio, 0, 4, true);
    const priceVsHigh = ((p.weekHigh52 - p.currentPrice) / p.weekHigh52) * 100;
    const discountScore = normalize(priceVsHigh, 0, 30);
    const score = peScore * 0.35 + pbScore * 0.25 + pegScore * 0.25 + discountScore * 0.15;
    if (p.pe < 20) reasons.push(`Attractive P/E of ${p.pe.toFixed(1)}`);
    if (p.pegRatio < 1.5) reasons.push(`Favorable PEG ratio of ${p.pegRatio.toFixed(2)}`);
    if (priceVsHigh > 10) reasons.push(`${priceVsHigh.toFixed(0)}% below 52-week high`);
    return { score: Math.round(score * 10) / 10, reasons };
}

// ── Factor 5: Liquidity ──
function calcLiquidityScore(s: StockData): { score: number; reasons: string[] } {
    const p = s.price;
    const reasons: string[] = [];
    const volScore = normalize(Math.log10(p.avgVolume), 4, 8);
    const mcapScore = normalize(Math.log10(p.marketCapValue), 3, 7);
    const floatScore = normalize(p.freeFloat, 10, 80);
    const score = volScore * 0.4 + mcapScore * 0.35 + floatScore * 0.25;
    if (p.avgVolume > 5000000) reasons.push('High trading volume');
    if (p.freeFloat > 50) reasons.push('Good free float availability');
    return { score: Math.round(score * 10) / 10, reasons };
}

// ── Factor 6: Market Stability (NEW) ──
function calcStabilityScore(s: StockData): { score: number; reasons: string[] } {
    const prices = s.historicalPrices;
    const reasons: string[] = [];
    if (prices.length < 3) return { score: 50, reasons: ['Insufficient price history'] };

    // Calculate trend consistency — how many months moved in same direction
    let upMonths = 0;
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] >= prices[i - 1]) upMonths++;
    }
    const trendConsistency = (upMonths / (prices.length - 1)) * 100;

    // Price recovery — how well it bounced from lows
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const currentPrice = s.price.currentPrice;
    const recoveryRatio = maxPrice > minPrice ? ((currentPrice - minPrice) / (maxPrice - minPrice)) * 100 : 50;

    // Institutional backing
    const institutionalHolding = s.holdings.fiiHolding + s.holdings.diiHolding;
    const institutionalScore = normalize(institutionalHolding, 0, 60);

    const score = trendConsistency * 0.35 + recoveryRatio * 0.35 + institutionalScore * 0.3;

    if (trendConsistency > 65) reasons.push(`Strong trend consistency (${trendConsistency.toFixed(0)}% up months)`);
    if (recoveryRatio > 70) reasons.push('Strong price recovery from lows');
    if (institutionalHolding > 35) reasons.push(`High institutional backing (${institutionalHolding.toFixed(1)}%)`);
    return { score: Math.round(score * 10) / 10, reasons };
}

// ── Factor 7: Volatility Profile (NEW) ──
function calcVolatilityScore(s: StockData): { score: number; reasons: string[] } {
    const prices = s.historicalPrices;
    const reasons: string[] = [];
    if (prices.length < 3) return { score: 50, reasons: ['Insufficient data'] };

    // Calculate std dev of monthly returns
    const returns: number[] = [];
    for (let i = 1; i < prices.length; i++) {
        returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((s, r) => s + (r - meanReturn) ** 2, 0) / returns.length;
    const stdDev = Math.sqrt(variance) * 100; // % monthly volatility

    // Lower volatility = higher score
    const volScore = normalize(stdDev, 0, 15, true);

    // Beta contribution
    const betaScore = normalize(s.price.beta, 0.3, 2, true);

    // 52-week range width
    const rangeWidth = ((s.price.weekHigh52 - s.price.weekLow52) / s.price.weekLow52) * 100;
    const rangeScore = normalize(rangeWidth, 0, 80, true);

    const score = volScore * 0.4 + betaScore * 0.35 + rangeScore * 0.25;

    if (stdDev < 5) reasons.push(`Low monthly volatility (${stdDev.toFixed(1)}%)`);
    if (s.price.beta < 0.9) reasons.push(`Low beta of ${s.price.beta.toFixed(2)}`);
    if (rangeWidth < 30) reasons.push('Narrow 52-week trading range');
    return { score: Math.round(score * 10) / 10, reasons };
}

// ── Factor 8: Capital Efficiency (NEW) ──
function calcCapitalEfficiencyScore(s: StockData): { score: number; reasons: string[] } {
    const f = s.financials;
    const reasons: string[] = [];

    // Return on Assets
    const roa = f.totalAssets > 0 ? (f.netProfit / f.totalAssets) * 100 : 0;
    const roaScore = normalize(roa, 0, 20);

    // Asset turnover efficiency
    const turnoverScore = normalize(f.assetTurnover, 0, 2);

    // FCF to Revenue ratio
    const fcfRatio = f.revenue > 0 ? (f.freeCashFlow / f.revenue) * 100 : 0;
    const fcfScore = normalize(fcfRatio, -5, 25);

    // Capital allocation (equity return vs cost)
    const equityEfficiency = f.totalEquity > 0 ? (f.netProfit / f.totalEquity) * 100 : 0;
    const equityScore = normalize(equityEfficiency, 0, 30);

    // Operating leverage
    const opLeverage = f.operatingMargin > 0 && f.revenueGrowth > 0
        ? normalize((f.operatingMargin / f.revenueGrowth) * 10, 0, 30)
        : 30;

    const score = roaScore * 0.25 + turnoverScore * 0.2 + fcfScore * 0.2 + equityScore * 0.2 + opLeverage * 0.15;

    if (roa > 10) reasons.push(`Strong ROA of ${roa.toFixed(1)}%`);
    if (fcfRatio > 10) reasons.push(`Healthy FCF/Revenue ratio of ${fcfRatio.toFixed(1)}%`);
    if (f.assetTurnover > 1) reasons.push(`Efficient asset utilization (${f.assetTurnover.toFixed(2)}x)`);
    return { score: Math.round(score * 10) / 10, reasons };
}

// ── Unified Dynamic Score Calculation ──
export const FACTOR_WEIGHTS = {
    fundamental: 0.20,
    growth: 0.15,
    risk: 0.15,
    valuation: 0.10,
    liquidity: 0.08,
    stability: 0.12,
    volatility: 0.10,
    capitalEfficiency: 0.10,
};

export function scoreStock(stock: StockData): EnhancedScoreBreakdown {
    const fundamental = calcFundamentalScore(stock);
    const growth = calcGrowthScore(stock);
    const risk = calcRiskScore(stock);
    const valuation = calcValuationScore(stock);
    const liquidity = calcLiquidityScore(stock);
    const stability = calcStabilityScore(stock);
    const volatility = calcVolatilityScore(stock);
    const capitalEfficiency = calcCapitalEfficiencyScore(stock);

    const compositeScore = Math.round(
        (fundamental.score * FACTOR_WEIGHTS.fundamental +
            growth.score * FACTOR_WEIGHTS.growth +
            risk.score * FACTOR_WEIGHTS.risk +
            valuation.score * FACTOR_WEIGHTS.valuation +
            liquidity.score * FACTOR_WEIGHTS.liquidity +
            stability.score * FACTOR_WEIGHTS.stability +
            volatility.score * FACTOR_WEIGHTS.volatility +
            capitalEfficiency.score * FACTOR_WEIGHTS.capitalEfficiency) * 10
    ) / 10;

    return {
        fundamentalScore: fundamental.score,
        growthScore: growth.score,
        riskScore: risk.score,
        valuationScore: valuation.score,
        liquidityScore: liquidity.score,
        stabilityScore: stability.score,
        volatilityScore: volatility.score,
        capitalEfficiencyScore: capitalEfficiency.score,
        compositeScore,
        reasoning: [
            ...fundamental.reasons, ...growth.reasons, ...risk.reasons,
            ...valuation.reasons, ...liquidity.reasons,
            ...stability.reasons, ...volatility.reasons, ...capitalEfficiency.reasons,
        ],
        factorWeights: FACTOR_WEIGHTS,
    };
}

export function scoreAllStocks(stocks: StockData[]): Array<{ stock: StockData; score: EnhancedScoreBreakdown }> {
    return stocks
        .map(stock => ({ stock, score: scoreStock(stock) }))
        .sort((a, b) => b.score.compositeScore - a.score.compositeScore);
}
