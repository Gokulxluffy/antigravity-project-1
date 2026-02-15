// ============================================================
// Decision Intelligence Engine (Include 1)
// Final authority layer: INVEST / DO NOT INVEST
// Pipeline: capital → AI score → risk → projection → optimization → probability → efficiency
// ============================================================
import { StockData, EnhancedScoreBreakdown, InvestmentDecision, RiskLevel, TimePeriod, PortfolioAllocation } from './types';
import { scoreStock } from './scoringEngine';

// ── Decision Thresholds ──
const INVEST_THRESHOLD = 48;
const HIGH_CONFIDENCE_THRESHOLD = 70;
const GRADE_THRESHOLDS = [
    { min: 85, grade: 'A+' as const },
    { min: 72, grade: 'A' as const },
    { min: 60, grade: 'B+' as const },
    { min: 48, grade: 'B' as const },
    { min: 35, grade: 'C' as const },
    { min: 20, grade: 'D' as const },
    { min: 0, grade: 'F' as const },
];

function getGrade(score: number) {
    return GRADE_THRESHOLDS.find(t => score >= t.min)?.grade || 'F';
}

// ── Time Horizon Suitability ──
function calcTimeHorizonSuitability(score: EnhancedScoreBreakdown, duration: TimePeriod): number {
    const growthWeight = duration === 'long' ? 0.4 : duration === 'medium' ? 0.25 : 0.1;
    const stabilityWeight = duration === 'short' ? 0.4 : duration === 'medium' ? 0.25 : 0.15;
    const valuationWeight = duration === 'long' ? 0.2 : 0.3;
    const volatilityWeight = duration === 'short' ? 0.3 : 0.15;

    return Math.round(
        (score.growthScore * growthWeight +
            score.stabilityScore * stabilityWeight +
            score.valuationScore * valuationWeight +
            score.volatilityScore * volatilityWeight) * 10
    ) / 10;
}

// ── Return Potential ──
function calcReturnPotential(score: EnhancedScoreBreakdown, duration: TimePeriod): number {
    const durationMultiplier = duration === 'long' ? 1.3 : duration === 'medium' ? 1.0 : 0.75;
    const baseReturn = (score.growthScore * 0.35 + score.fundamentalScore * 0.25 +
        score.valuationScore * 0.2 + score.capitalEfficiencyScore * 0.2);
    return Math.round(Math.min(100, baseReturn * durationMultiplier) * 10) / 10;
}

// ── Capital Efficiency ──
function calcCapitalEfficiency(score: EnhancedScoreBreakdown, capital: number): number {
    // Higher score = better use of capital
    const base = score.capitalEfficiencyScore * 0.4 +
        score.liquidityScore * 0.25 +
        score.fundamentalScore * 0.2 +
        score.stabilityScore * 0.15;

    // Scale adjustment: smaller capital needs more liquid/stable stocks
    const scaleBonus = capital < 100000 ? (score.liquidityScore > 60 ? 5 : -5)
        : capital > 1000000 ? (score.fundamentalScore > 60 ? 5 : -5)
            : 0;

    return Math.round(Math.max(0, Math.min(100, base + scaleBonus)) * 10) / 10;
}

// ── Portfolio Fit ──
function calcPortfolioFit(
    score: EnhancedScoreBreakdown,
    riskProfile: RiskLevel,
    existingPortfolio?: PortfolioAllocation
): number {
    let fit = 50;

    // Risk alignment
    if (riskProfile === 'conservative') {
        fit += score.riskScore > 60 ? 20 : score.riskScore > 40 ? 10 : -10;
        fit += score.volatilityScore > 60 ? 10 : -5;
        fit += score.stabilityScore > 55 ? 10 : -5;
    } else if (riskProfile === 'moderate') {
        fit += score.compositeScore > 55 ? 15 : score.compositeScore > 40 ? 5 : -5;
        fit += score.growthScore > 50 ? 10 : 0;
    } else {
        fit += score.growthScore > 55 ? 20 : score.growthScore > 35 ? 10 : -5;
        fit += score.capitalEfficiencyScore > 50 ? 10 : 0;
    }

    // Diversification bonus if portfolio context exists
    if (existingPortfolio) {
        const sectors = Object.keys(existingPortfolio.sectorAllocation).length;
        fit += sectors > 4 ? 5 : -5;
    }

    return Math.round(Math.max(0, Math.min(100, fit)) * 10) / 10;
}

// ── Risk Justification Logic ──
function generateRiskJustification(score: EnhancedScoreBreakdown, riskProfile: RiskLevel): string[] {
    const justifications: string[] = [];

    if (score.riskScore > 65) {
        justifications.push('Low financial risk profile — strong balance sheet and stable holdings');
    } else if (score.riskScore > 45) {
        justifications.push('Moderate risk profile — acceptable for balanced investors');
    } else {
        justifications.push('Elevated risk exposure — suitable only for aggressive investors');
    }

    if (score.volatilityScore > 60) {
        justifications.push('Price volatility within acceptable range');
    } else {
        justifications.push('Higher price volatility — expect wider price swings');
    }

    if (score.stabilityScore > 55) {
        justifications.push('Market stability indicators positive — consistent performance trend');
    } else {
        justifications.push('Market stability concerns — inconsistent price action');
    }

    if (riskProfile === 'conservative' && score.riskScore < 50) {
        justifications.push('⚠ Risk level exceeds conservative profile tolerance');
    }
    if (riskProfile === 'aggressive' && score.riskScore > 70) {
        justifications.push('Risk level well within aggressive profile comfort zone');
    }

    if (score.fundamentalScore > 60) {
        justifications.push('Strong fundamental backing reduces downside risk');
    }
    if (score.capitalEfficiencyScore > 55) {
        justifications.push('Efficient capital deployment supports sustained returns');
    }

    return justifications;
}

// ── Confidence Calculation ──
function calcConfidence(score: EnhancedScoreBreakdown, duration: TimePeriod): number {
    const base = 30;
    const compositeContrib = score.compositeScore * 0.4;
    const consistencyBonus = (
        Math.min(score.fundamentalScore, score.growthScore, score.riskScore) > 40
    ) ? 10 : 0;
    const durationBonus = duration === 'long' ? 8 : duration === 'medium' ? 4 : 0;
    const dataQuality = score.reasoning.length * 1.5;

    return Math.round(Math.min(95, base + compositeContrib + consistencyBonus + durationBonus + dataQuality) * 10) / 10;
}

// ============================================================
// MAIN: Make Investment Decision
// ============================================================
export function makeDecision(
    stock: StockData,
    capital: number,
    duration: TimePeriod,
    riskProfile: RiskLevel,
    existingPortfolio?: PortfolioAllocation
): InvestmentDecision {
    const score = scoreStock(stock);

    const confidencePercent = calcConfidence(score, duration);
    const returnPotentialScore = calcReturnPotential(score, duration);
    const timeHorizonSuitability = calcTimeHorizonSuitability(score, duration);
    const capitalEfficiency = calcCapitalEfficiency(score, capital);
    const portfolioFitScore = calcPortfolioFit(score, riskProfile, existingPortfolio);
    const riskJustification = generateRiskJustification(score, riskProfile);

    // Weighted decision score
    const decisionScore = (
        score.compositeScore * 0.30 +
        returnPotentialScore * 0.20 +
        timeHorizonSuitability * 0.15 +
        capitalEfficiency * 0.15 +
        portfolioFitScore * 0.10 +
        confidencePercent * 0.10
    );

    const verdict = decisionScore >= INVEST_THRESHOLD ? 'INVEST' : 'DO NOT INVEST';
    const overallGrade = getGrade(decisionScore);

    const summary = verdict === 'INVEST'
        ? `${stock.company.name} (${stock.company.symbol}) receives an INVEST recommendation with ${confidencePercent}% confidence. ` +
        `The stock scores ${score.compositeScore}/100 across 8 AI factors, with a ${overallGrade} grade. ` +
        `Expected return potential: ${returnPotentialScore}/100. Time-horizon fit: ${timeHorizonSuitability}/100 for ${duration}-term investing.`
        : `${stock.company.name} (${stock.company.symbol}) receives a DO NOT INVEST recommendation. ` +
        `The stock's composite score of ${score.compositeScore}/100 and decision score of ${decisionScore.toFixed(1)} ` +
        `fall below the investment threshold. Key concerns: ${riskJustification.filter(r => r.includes('⚠') || r.includes('concern') || r.includes('Elevated')).join('; ') || 'Insufficient risk-adjusted return potential'}.`;

    return {
        verdict,
        confidencePercent,
        riskJustification,
        returnPotentialScore,
        timeHorizonSuitability,
        capitalEfficiency,
        portfolioFitScore,
        overallGrade,
        summary,
    };
}

// ── Batch Decision for All Stocks ──
export function makeDecisionBatch(
    stocks: StockData[],
    capital: number,
    duration: TimePeriod,
    riskProfile: RiskLevel
): Array<{ stock: StockData; decision: InvestmentDecision }> {
    return stocks
        .map(stock => ({ stock, decision: makeDecision(stock, capital, duration, riskProfile) }))
        .sort((a, b) => {
            // INVEST first, then by confidence
            if (a.decision.verdict !== b.decision.verdict) {
                return a.decision.verdict === 'INVEST' ? -1 : 1;
            }
            return b.decision.confidencePercent - a.decision.confidencePercent;
        });
}
