// ============================================================
// Explainable AI Layer (Include 8)
// Every AI decision provides traceable reasoning
// ============================================================
import { StockData, EnhancedScoreBreakdown, ExplainableResult, InvestmentDecision } from './types';
import { FACTOR_WEIGHTS } from './scoringEngine';

const TIMESTAMP = () => new Date().toISOString();

// Factor labels for display
const FACTOR_LABELS: Record<string, string> = {
    fundamental: 'Financial Strength',
    growth: 'Growth Potential',
    risk: 'Risk Exposure',
    valuation: 'Valuation Attractiveness',
    liquidity: 'Market Liquidity',
    stability: 'Market Stability',
    volatility: 'Volatility Profile',
    capitalEfficiency: 'Capital Efficiency',
};

function getFactorExplanation(factor: string, score: number): string {
    const level = score >= 70 ? 'strong' : score >= 50 ? 'moderate' : score >= 30 ? 'weak' : 'very weak';
    return `${FACTOR_LABELS[factor] || factor} scored ${score.toFixed(1)}/100 (${level}). This factor contributes ${((FACTOR_WEIGHTS[factor as keyof typeof FACTOR_WEIGHTS] || 0) * 100).toFixed(0)}% to the composite score.`;
}

export function generateExplanation(
    stock: StockData,
    score: EnhancedScoreBreakdown,
    decision: InvestmentDecision
): ExplainableResult {
    const f = stock.financials;
    const p = stock.price;
    const h = stock.holdings;

    // ── Score Breakdown ──
    const scoreBreakdown = [
        { factor: 'fundamental', score: score.fundamentalScore, weight: FACTOR_WEIGHTS.fundamental, contribution: score.fundamentalScore * FACTOR_WEIGHTS.fundamental, explanation: getFactorExplanation('fundamental', score.fundamentalScore) },
        { factor: 'growth', score: score.growthScore, weight: FACTOR_WEIGHTS.growth, contribution: score.growthScore * FACTOR_WEIGHTS.growth, explanation: getFactorExplanation('growth', score.growthScore) },
        { factor: 'risk', score: score.riskScore, weight: FACTOR_WEIGHTS.risk, contribution: score.riskScore * FACTOR_WEIGHTS.risk, explanation: getFactorExplanation('risk', score.riskScore) },
        { factor: 'valuation', score: score.valuationScore, weight: FACTOR_WEIGHTS.valuation, contribution: score.valuationScore * FACTOR_WEIGHTS.valuation, explanation: getFactorExplanation('valuation', score.valuationScore) },
        { factor: 'liquidity', score: score.liquidityScore, weight: FACTOR_WEIGHTS.liquidity, contribution: score.liquidityScore * FACTOR_WEIGHTS.liquidity, explanation: getFactorExplanation('liquidity', score.liquidityScore) },
        { factor: 'stability', score: score.stabilityScore, weight: FACTOR_WEIGHTS.stability, contribution: score.stabilityScore * FACTOR_WEIGHTS.stability, explanation: getFactorExplanation('stability', score.stabilityScore) },
        { factor: 'volatility', score: score.volatilityScore, weight: FACTOR_WEIGHTS.volatility, contribution: score.volatilityScore * FACTOR_WEIGHTS.volatility, explanation: getFactorExplanation('volatility', score.volatilityScore) },
        { factor: 'capitalEfficiency', score: score.capitalEfficiencyScore, weight: FACTOR_WEIGHTS.capitalEfficiency, contribution: score.capitalEfficiencyScore * FACTOR_WEIGHTS.capitalEfficiency, explanation: getFactorExplanation('capitalEfficiency', score.capitalEfficiencyScore) },
    ];

    // ── Logical Reasoning ──
    const logicalReasoning: string[] = [
        `${stock.company.name} operates in the ${stock.company.sector} sector with a market capitalization of ₹${(stock.company.marketCap / 100).toFixed(0)} billion.`,
        `The AI engine evaluated ${scoreBreakdown.length} independent factors using weighted analysis.`,
        `Composite AI score: ${score.compositeScore}/100 (${decision.overallGrade} grade).`,
        decision.verdict === 'INVEST'
            ? `The stock meets the investment threshold with ${decision.confidencePercent}% confidence.`
            : `The stock falls below the investment threshold — risk-adjusted returns insufficient.`,
        `Capital efficiency rating: ${decision.capitalEfficiency}/100 — ${decision.capitalEfficiency > 60 ? 'efficient' : 'below optimal'} capital utilization expected.`,
    ];

    // ── Financial Justification ──
    const financialJustification: string[] = [
        `Revenue: ₹${f.revenue.toLocaleString()} Cr with ${f.revenueGrowth > 0 ? '+' : ''}${f.revenueGrowth}% YoY growth`,
        `Net Profit Margin: ${f.netProfitMargin}% — ${f.netProfitMargin > 15 ? 'above industry benchmark' : f.netProfitMargin > 8 ? 'within acceptable range' : 'below desired threshold'}`,
        `ROE: ${f.roe}% / ROCE: ${f.roce}% — ${f.roe > 18 ? 'demonstrates strong equity returns' : 'moderate equity efficiency'}`,
        `Debt-to-Equity: ${f.debtToEquity.toFixed(2)} — ${f.debtToEquity < 0.5 ? 'conservative leverage' : f.debtToEquity < 1.5 ? 'moderate leverage' : 'high leverage risk'}`,
        `EPS Growth: ${f.epsGrowth > 0 ? '+' : ''}${f.epsGrowth}% — ${f.epsGrowth > 15 ? 'strong earnings momentum' : 'moderate earnings performance'}`,
        `Free Cash Flow: ₹${f.freeCashFlow.toLocaleString()} Cr — ${f.freeCashFlow > 0 ? 'positive cash generation' : 'negative cash flow concern'}`,
    ];

    // ── Risk Explanation ──
    const riskExplanation: string[] = [
        `Market Beta: ${p.beta.toFixed(2)} — ${p.beta < 0.8 ? 'lower systematic risk than market' : p.beta < 1.2 ? 'market-average risk' : 'higher systematic risk'}`,
        `Promoter Holding: ${h.promoterHolding}% — ${h.promoterHolding > 50 ? 'strong promoter confidence' : 'moderate promoter stake'}`,
        `Pledged Shares: ${h.pledgedPercentage}% — ${h.pledgedPercentage === 0 ? 'no shares pledged' : h.pledgedPercentage < 5 ? 'minimal pledge risk' : 'significant pledge risk'}`,
        `52-Week Range: ₹${p.weekLow52.toFixed(0)} – ₹${p.weekHigh52.toFixed(0)} (current: ₹${p.currentPrice.toFixed(0)})`,
        `P/E Ratio: ${p.pe.toFixed(1)} — ${p.pe < 20 ? 'value territory' : p.pe < 40 ? 'fairly valued' : 'premium valuation'}`,
    ];

    // ── Return Rationale ──
    const returnRationale: string[] = [
        `Return potential score: ${decision.returnPotentialScore}/100`,
        `Based on ${f.revenueCAGR3Y}% 3-year revenue CAGR and ${f.profitCAGR3Y}% profit CAGR`,
        `Growth trajectory ${f.revenueGrowth > f.revenueCAGR3Y ? 'accelerating' : 'stable'} relative to historical trend`,
        `Dividend yield of ${f.dividendYield}% provides ${f.dividendYield > 2 ? 'meaningful' : 'modest'} income component`,
        decision.timeHorizonSuitability > 60
            ? `Strong alignment with chosen investment time horizon`
            : `Moderate alignment with chosen time horizon — consider adjusting duration`,
    ];

    // ── Forecast Reasoning ──
    const forecastReasoning: string[] = [
        `AI model projects ${decision.verdict === 'INVEST' ? 'positive' : 'uncertain'} outlook based on multi-factor analysis`,
        `Growth score of ${score.growthScore}/100 indicates ${score.growthScore > 60 ? 'strong' : score.growthScore > 40 ? 'moderate' : 'limited'} future growth potential`,
        `Market stability score of ${score.stabilityScore}/100 suggests ${score.stabilityScore > 60 ? 'consistent' : 'volatile'} forward performance`,
        `Capital efficiency of ${score.capitalEfficiencyScore}/100 supports ${score.capitalEfficiencyScore > 55 ? 'efficient' : 'suboptimal'} wealth compounding`,
    ];

    // ── Data Transparency ──
    const dataTransparency = [
        { metric: 'Revenue', value: `₹${f.revenue.toLocaleString()} Cr`, source: 'Company Financials (Annual Report)' },
        { metric: 'Net Profit', value: `₹${f.netProfit.toLocaleString()} Cr`, source: 'Company Financials (P&L Statement)' },
        { metric: 'Current Price', value: `₹${p.currentPrice.toFixed(2)}`, source: 'NSE/BSE Live Feed' },
        { metric: 'P/E Ratio', value: p.pe.toFixed(1), source: 'Calculated: Price / EPS' },
        { metric: 'Market Cap', value: `₹${stock.company.marketCap.toLocaleString()} Cr`, source: 'Exchange Data' },
        { metric: 'Promoter Holding', value: `${h.promoterHolding}%`, source: 'SEBI Quarterly Filings' },
        { metric: 'Beta', value: p.beta.toFixed(2), source: '52-Week Regression vs Nifty 50' },
        { metric: 'Composite AI Score', value: `${score.compositeScore}/100`, source: 'InvestIQ 8-Factor AI Engine v2.0' },
    ];

    // ── Audit Trail ──
    const auditTrail = [
        { step: 'Data Ingestion', input: `${stock.company.symbol} financial data`, output: '23 financial metrics loaded', timestamp: TIMESTAMP() },
        { step: 'Factor Computation', input: '8 scoring factors', output: `Scores: [${scoreBreakdown.map(s => s.score.toFixed(0)).join(', ')}]`, timestamp: TIMESTAMP() },
        { step: 'Weight Application', input: `Weights: [${Object.values(FACTOR_WEIGHTS).join(', ')}]`, output: `Composite: ${score.compositeScore}`, timestamp: TIMESTAMP() },
        { step: 'Risk Assessment', input: `Risk profile analysis`, output: `Risk score: ${score.riskScore}/100`, timestamp: TIMESTAMP() },
        { step: 'Decision Computation', input: `Composite + Portfolio Fit + Confidence`, output: `${decision.verdict} (${decision.confidencePercent}%)`, timestamp: TIMESTAMP() },
        { step: 'Grade Assignment', input: `Decision score`, output: `Grade: ${decision.overallGrade}`, timestamp: TIMESTAMP() },
    ];

    return {
        logicalReasoning,
        financialJustification,
        scoreBreakdown,
        riskExplanation,
        returnRationale,
        forecastReasoning,
        dataTransparency,
        auditTrail,
    };
}
