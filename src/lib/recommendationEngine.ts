// ============================================================
// Recommendation Engine (Updated for Enhanced Scoring)
// ============================================================
import { StockData, StockRecommendation, PortfolioAllocation, RiskLevel, TimePeriod, MarketCap } from './types';
import { allStocks } from './stockData';
import { scoreAllStocks } from './scoringEngine';
import { filterByRisk, allocatePortfolio, estimateReturns } from './portfolioEngine';

function generateRationale(stock: StockData, score: ReturnType<typeof scoreAllStocks>[0]['score']): string {
    const parts: string[] = [];
    if (score.fundamentalScore > 60) parts.push(`strong fundamentals (score: ${score.fundamentalScore})`);
    if (score.growthScore > 50) parts.push(`solid growth trajectory (score: ${score.growthScore})`);
    if (score.riskScore > 55) parts.push(`favorable risk profile (score: ${score.riskScore})`);
    if (score.valuationScore > 50) parts.push(`reasonable valuation (score: ${score.valuationScore})`);
    if (score.stabilityScore > 55) parts.push(`stable market behavior (score: ${score.stabilityScore})`);
    if (score.capitalEfficiencyScore > 55) parts.push(`efficient capital use (score: ${score.capitalEfficiencyScore})`);
    return `${stock.company.name} demonstrates ${parts.join(', ')} with a composite score of ${score.compositeScore}/100. ` +
        `The company operates in the ${stock.company.sector} sector with ₹${(stock.company.marketCap / 100).toFixed(0)}B market cap.`;
}

function getKeyStrengths(stock: StockData): string[] {
    const strengths: string[] = [];
    const f = stock.financials;
    const h = stock.holdings;
    if (f.roe > 18) strengths.push(`High ROE of ${f.roe}%`);
    if (f.roce > 18) strengths.push(`Strong ROCE of ${f.roce}%`);
    if (f.revenueGrowth > 15) strengths.push(`Revenue growing at ${f.revenueGrowth}%`);
    if (f.netProfitMargin > 15) strengths.push(`${f.netProfitMargin}% net profit margin`);
    if (f.debtToEquity < 0.5) strengths.push('Very low debt');
    if (h.promoterHolding > 50) strengths.push(`${h.promoterHolding}% promoter confidence`);
    if (f.freeCashFlow > 0) strengths.push('Positive free cash flow');
    return strengths.slice(0, 4);
}

function getKeyRisks(stock: StockData): string[] {
    const risks: string[] = [];
    const f = stock.financials;
    const p = stock.price;
    const h = stock.holdings;
    if (f.debtToEquity > 1.5) risks.push(`High debt-to-equity of ${f.debtToEquity}`);
    if (p.pe > 50) risks.push(`Elevated P/E of ${p.pe}`);
    if (p.beta > 1.3) risks.push('Higher market volatility');
    if (h.pledgedPercentage > 5) risks.push(`${h.pledgedPercentage}% shares pledged`);
    if (f.netProfitMargin < 5) risks.push('Thin profit margins');
    if (risks.length === 0) risks.push('Sector cyclicality risk');
    return risks.slice(0, 3);
}

function getRiskRating(stock: StockData, riskScore: number): RiskLevel {
    if (riskScore > 65) return 'conservative';
    if (riskScore > 45) return 'moderate';
    return 'aggressive';
}

export function generateRecommendations(
    capital: number,
    duration: TimePeriod,
    riskProfile: RiskLevel
): PortfolioAllocation {
    const scored = scoreAllStocks(allStocks);
    const filtered = filterByRisk(scored, { riskProfile, duration, capital });
    const allocated = allocatePortfolio(filtered, { riskProfile, duration, capital });

    const recommendations: StockRecommendation[] = allocated.map(item => {
        const { expectedReturn, confidence } = estimateReturns(item.score, riskProfile, duration);
        return {
            stock: item.stock,
            score: item.score,
            allocatedCapital: item.capitalAlloc,
            allocatedPercentage: item.allocation,
            expectedReturn,
            riskRating: getRiskRating(item.stock, item.score.riskScore),
            confidenceScore: confidence,
            rationale: generateRationale(item.stock, item.score),
            keyStrengths: getKeyStrengths(item.stock),
            keyRisks: getKeyRisks(item.stock),
        };
    });

    // Calculate aggregate metrics
    const sectorAllocation: Record<string, number> = {};
    const capAllocation: Record<MarketCap, number> = { large: 0, mid: 0, small: 0 };
    let totalAllocated = 0;

    recommendations.forEach(r => {
        const sector = r.stock.company.sector;
        sectorAllocation[sector] = (sectorAllocation[sector] || 0) + r.allocatedPercentage;
        capAllocation[r.stock.company.marketCapCategory] += r.allocatedPercentage;
        totalAllocated += r.allocatedPercentage;
    });

    if (totalAllocated > 0) {
        Object.keys(sectorAllocation).forEach(k => {
            sectorAllocation[k] = Math.round(sectorAllocation[k] / totalAllocated * 1000) / 10;
        });
        (['large', 'mid', 'small'] as MarketCap[]).forEach(k => {
            capAllocation[k] = Math.round(capAllocation[k] / totalAllocated * 1000) / 10;
        });
    }

    const avgReturn = recommendations.length > 0
        ? Math.round(recommendations.reduce((s, r) => s + r.expectedReturn * r.allocatedPercentage, 0) / totalAllocated * 10) / 10
        : 0;
    const avgRisk = recommendations.length > 0
        ? Math.round(recommendations.reduce((s, r) => s + r.score.riskScore * r.allocatedPercentage, 0) / totalAllocated * 10) / 10
        : 0;
    const avgConfidence = recommendations.length > 0
        ? Math.round(recommendations.reduce((s, r) => s + r.confidenceScore * r.allocatedPercentage, 0) / totalAllocated * 10) / 10
        : 0;

    const uniqueSectors = Object.keys(sectorAllocation).length;
    const maxSectorAlloc = Math.max(...Object.values(sectorAllocation), 0);
    const diversificationScore = Math.round(Math.min(100, uniqueSectors * 12 + (100 - maxSectorAlloc)) * 10) / 10;

    return {
        totalCapital: capital,
        investmentDuration: duration,
        riskProfile,
        recommendations,
        sectorAllocation,
        capAllocation,
        expectedPortfolioReturn: avgReturn,
        portfolioRiskScore: avgRisk,
        confidenceIndex: avgConfidence,
        diversificationScore,
    };
}
