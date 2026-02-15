// ============================================================
// Investment Advisory Intelligence (Include 9)
// Decision-support system, not just a recommender
// ============================================================
import { StockData, PortfolioAllocation, RiskLevel, TimePeriod, AdvisoryReport, EnhancedScoreBreakdown } from './types';
import { scoreAllStocks } from './scoringEngine';
import { allStocks } from './stockData';

// ── Market Condition Analysis ──
function analyzeMarketConditions(): AdvisoryReport['marketConditionAnalysis'] {
    const scored = scoreAllStocks(allStocks);
    const avgScore = scored.reduce((s, x) => s + x.score.compositeScore, 0) / scored.length;
    const avgGrowth = allStocks.reduce((s, x) => s + x.financials.revenueGrowth, 0) / allStocks.length;
    const avgBeta = allStocks.reduce((s, x) => s + x.price.beta, 0) / allStocks.length;
    const avgPE = allStocks.reduce((s, x) => s + x.price.pe, 0) / allStocks.length;

    return [
        {
            factor: 'Market Sentiment',
            status: avgScore > 55 ? 'bullish' : avgScore > 42 ? 'neutral' : 'bearish',
            impact: `Average AI score across ${allStocks.length} stocks: ${avgScore.toFixed(1)}/100. ${avgScore > 55 ? 'Broad market strength supports equity allocation.' : 'Cautious positioning recommended.'}`,
        },
        {
            factor: 'Growth Outlook',
            status: avgGrowth > 12 ? 'bullish' : avgGrowth > 5 ? 'neutral' : 'bearish',
            impact: `Average revenue growth: ${avgGrowth.toFixed(1)}%. ${avgGrowth > 12 ? 'Corporate earnings trajectory positive.' : 'Growth moderation expected.'}`,
        },
        {
            factor: 'Market Volatility',
            status: avgBeta > 1.15 ? 'bearish' : avgBeta > 0.85 ? 'neutral' : 'bullish',
            impact: `Average market beta: ${avgBeta.toFixed(2)}. ${avgBeta < 1 ? 'Lower-than-market volatility environment.' : 'Standard market volatility.'}`,
        },
        {
            factor: 'Valuations',
            status: avgPE < 22 ? 'bullish' : avgPE < 35 ? 'neutral' : 'bearish',
            impact: `Average P/E ratio: ${avgPE.toFixed(1)}. ${avgPE < 25 ? 'Valuations reasonable — supports entry.' : 'Elevated valuations — selectivity important.'}`,
        },
        {
            factor: 'Institutional Interest',
            status: 'neutral',
            impact: 'FII/DII flows mixed. Sector rotation underway — technology and financials seeing maximum institutional activity.',
        },
        {
            factor: 'Policy Environment',
            status: 'neutral',
            impact: 'RBI policy stance accommodative. Government capex focus creates tailwinds for infrastructure and manufacturing.',
        },
    ];
}

// ── Capital Deployment Plan ──
function generateDeploymentPlan(capital: number, riskProfile: RiskLevel, duration: TimePeriod): AdvisoryReport['capitalDeploymentPlan'] {
    if (riskProfile === 'conservative') {
        return [
            { phase: 'Phase 1 — Core Allocation (Immediate)', percentage: 50, description: 'Deploy 50% into top-rated large-cap stocks with strong dividends and low beta.' },
            { phase: 'Phase 2 — Gradual Entry (Month 1-2)', percentage: 30, description: 'Allocate 30% into value picks with P/E below sector average. Use systematic investment approach.' },
            { phase: 'Phase 3 — Tactical Reserve (Month 3+)', percentage: 20, description: 'Hold 20% as tactical reserve for market dips or new opportunities.' },
        ];
    } else if (riskProfile === 'aggressive') {
        return [
            { phase: 'Phase 1 — Growth Core (Immediate)', percentage: 40, description: 'Deploy 40% into high-growth mid-cap and small-cap leaders with strong AI scores.' },
            { phase: 'Phase 2 — Momentum Play (Week 2-3)', percentage: 35, description: 'Allocate 35% to momentum stocks with strong recent price action and institutional buying.' },
            { phase: 'Phase 3 — Alpha Bets (Month 1+)', percentage: 25, description: 'Allocate 25% to high-conviction picks with potential for outsized returns.' },
        ];
    }
    return [
        { phase: 'Phase 1 — Foundation (Immediate)', percentage: 40, description: 'Deploy 40% into balanced large and mid-cap stocks with composite scores above 60.' },
        { phase: 'Phase 2 — Growth Tilt (Week 2-4)', percentage: 35, description: 'Allocate 35% into growth-oriented picks with revenue CAGR above 15% and strong fundamentals.' },
        { phase: 'Phase 3 — Opportunistic (Month 2+)', percentage: 25, description: 'Reserve 25% for tactical opportunities identified by the AI engine during market fluctuations.' },
    ];
}

// ── Risk-Adjusted Recommendations ──
function generateRiskAdjustedRecs(portfolio: PortfolioAllocation): AdvisoryReport['riskAdjustedRecommendations'] {
    const recs: AdvisoryReport['riskAdjustedRecommendations'] = [];
    const scored = scoreAllStocks(allStocks);

    // Portfolio-level recommendations
    if (portfolio.diversificationScore < 60) {
        recs.push({ action: 'Increase sector diversification', reason: `Diversification score ${portfolio.diversificationScore}/100 is below optimal. Add exposure to underrepresented sectors.`, priority: 'high' });
    }
    if (portfolio.portfolioRiskScore < 40) {
        recs.push({ action: 'Add defensive positions', reason: 'Portfolio risk score indicates elevated exposure. Consider adding large-cap dividend stocks.', priority: 'high' });
    }
    if (portfolio.expectedPortfolioReturn < 10) {
        recs.push({ action: 'Enhance growth exposure', reason: 'Expected portfolio return below 10%. Consider adding stocks with higher growth scores.', priority: 'medium' });
    }

    // Top upgrades
    const topScored = scored.slice(0, 3);
    const inPortfolio = new Set(portfolio.recommendations.map(r => r.stock.company.symbol));
    topScored.forEach(s => {
        if (!inPortfolio.has(s.stock.company.symbol)) {
            recs.push({
                action: `Consider adding ${s.stock.company.symbol}`,
                reason: `AI score ${s.score.compositeScore}/100 — ranks in top 3 but not in current portfolio. Strong ${s.score.fundamentalScore > s.score.growthScore ? 'fundamentals' : 'growth'}.`,
                priority: 'medium',
            });
        }
    });

    // Monitor list
    portfolio.recommendations.forEach(r => {
        if (r.score.compositeScore < 45) {
            recs.push({
                action: `Review ${r.stock.company.symbol} position`,
                reason: `AI score declined to ${r.score.compositeScore}/100. Consider reducing allocation if fundamentals deteriorate further.`,
                priority: 'low',
            });
        }
    });

    return recs;
}

// ── Time-Based Strategies ──
function generateTimeBasedStrategies(duration: TimePeriod): AdvisoryReport['timeBasedStrategy'] {
    if (duration === 'short') {
        return [
            { horizon: '0-3 months', strategy: 'Momentum & Value', expectedOutcome: 'Target 8-12% returns from undervalued stocks with positive momentum' },
            { horizon: '3-6 months', strategy: 'Tactical Rebalancing', expectedOutcome: 'Lock gains on 15%+ movers, rotate into new opportunities' },
            { horizon: '6-12 months', strategy: 'Exit Planning', expectedOutcome: 'Systematic exit with trailing stop-loss at 10% from peak' },
        ];
    }
    if (duration === 'long') {
        return [
            { horizon: '0-1 year', strategy: 'Accumulation Phase', expectedOutcome: 'Build core positions in quality compounders. Target 15+ stocks.' },
            { horizon: '1-3 years', strategy: 'Growth Compounding', expectedOutcome: 'Let winners run, prune underperformers below score 40. Target 18-22% CAGR.' },
            { horizon: '3-5+ years', strategy: 'Wealth Creation', expectedOutcome: 'Long-term compounding with annual rebalancing. Target 2-3x capital appreciation.' },
        ];
    }
    return [
        { horizon: '0-6 months', strategy: 'Build & Optimize', expectedOutcome: 'Deploy capital across diversified portfolio. Establish baseline allocation.' },
        { horizon: '6-18 months', strategy: 'Active Management', expectedOutcome: 'Quarterly rebalancing based on AI score changes. Target 14-18% returns.' },
        { horizon: '18-36 months', strategy: 'Growth Harvesting', expectedOutcome: 'Harvest partial gains, reinvest dividends, optimize tax efficiency.' },
    ];
}

// ── Portfolio Alignment Check ──
function checkPortfolioAlignment(portfolio: PortfolioAllocation): AdvisoryReport['portfolioAlignment'] {
    const targets = {
        conservative: { diversification: 70, riskScore: 60, returnTarget: 12, maxSingleAlloc: 15 },
        moderate: { diversification: 60, riskScore: 50, returnTarget: 16, maxSingleAlloc: 12 },
        aggressive: { diversification: 50, riskScore: 35, returnTarget: 22, maxSingleAlloc: 10 },
    };
    const t = targets[portfolio.riskProfile];
    const maxAlloc = Math.max(...portfolio.recommendations.map(r => r.allocatedPercentage), 0);

    return [
        {
            metric: 'Diversification',
            current: portfolio.diversificationScore,
            target: t.diversification,
            status: portfolio.diversificationScore >= t.diversification ? 'aligned' : portfolio.diversificationScore >= t.diversification * 0.8 ? 'partial' : 'misaligned',
        },
        {
            metric: 'Risk Score',
            current: portfolio.portfolioRiskScore,
            target: t.riskScore,
            status: portfolio.portfolioRiskScore >= t.riskScore ? 'aligned' : portfolio.portfolioRiskScore >= t.riskScore * 0.8 ? 'partial' : 'misaligned',
        },
        {
            metric: 'Expected Return',
            current: portfolio.expectedPortfolioReturn,
            target: t.returnTarget,
            status: portfolio.expectedPortfolioReturn >= t.returnTarget ? 'aligned' : portfolio.expectedPortfolioReturn >= t.returnTarget * 0.8 ? 'partial' : 'misaligned',
        },
        {
            metric: 'Concentration',
            current: maxAlloc,
            target: t.maxSingleAlloc,
            status: maxAlloc <= t.maxSingleAlloc ? 'aligned' : maxAlloc <= t.maxSingleAlloc * 1.2 ? 'partial' : 'misaligned',
        },
        {
            metric: 'Confidence Index',
            current: portfolio.confidenceIndex,
            target: 65,
            status: portfolio.confidenceIndex >= 65 ? 'aligned' : portfolio.confidenceIndex >= 50 ? 'partial' : 'misaligned',
        },
    ];
}

// ============================================================
// MAIN: Generate Advisory Report
// ============================================================
export function generateAdvisory(
    portfolio: PortfolioAllocation,
): AdvisoryReport {
    const { riskProfile, investmentDuration, totalCapital } = portfolio;

    const strategyLabel = riskProfile === 'conservative' ? 'Capital Preservation with Moderate Growth'
        : riskProfile === 'aggressive' ? 'Aggressive Growth Maximization'
            : 'Balanced Growth with Risk Management';

    return {
        investmentStrategy: `Strategy: ${strategyLabel} | Capital: ₹${(totalCapital / 100000).toFixed(1)}L | Duration: ${investmentDuration}-term | Risk Profile: ${riskProfile}. The AI advisory engine recommends a ${riskProfile === 'conservative' ? 'defensive' : riskProfile === 'aggressive' ? 'growth-oriented' : 'balanced'} approach with systematic capital deployment across ${portfolio.recommendations.length} positions spanning ${Object.keys(portfolio.sectorAllocation).length} sectors.`,
        capitalDeploymentPlan: generateDeploymentPlan(totalCapital, riskProfile, investmentDuration),
        riskAdjustedRecommendations: generateRiskAdjustedRecs(portfolio),
        timeBasedStrategy: generateTimeBasedStrategies(investmentDuration),
        portfolioAlignment: checkPortfolioAlignment(portfolio),
        marketConditionAnalysis: analyzeMarketConditions(),
        financialObjectiveAlignment: Math.round(
            (portfolio.confidenceIndex * 0.3 + portfolio.diversificationScore * 0.3 + Math.min(100, portfolio.expectedPortfolioReturn * 5) * 0.4) * 10
        ) / 10,
    };
}
