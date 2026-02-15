import { Company, Financials, MarketData, AIScores } from "@/types/finance";

// --- WEIGHTS CONFIGURATION ---
const WEIGHTS = {
    FINANCIAL_HEALTH: 0.25,
    GROWTH: 0.20,
    RISK: 0.15,
    VALUATION: 0.15,
    SENTIMENT: 0.10,
    MACRO: 0.10,
    GOVERNANCE: 0.05
};

// --- SCORING FUNCTIONS ---

/**
 * Calculates Financial Health Score (0-100)
 * Metric: Debt-to-Equity, Operating Margin, Current Ratio (implied)
 */
function calculateFinancialHealth(financials: Financials): number {
    let score = 50; // Base score

    // 1. Debt to Equity Analysis
    if (financials.debtToEquity < 0.1) score += 25;
    else if (financials.debtToEquity < 0.5) score += 15;
    else if (financials.debtToEquity < 1.0) score += 5;
    else if (financials.debtToEquity > 2.0) score -= 15;

    // 2. Profit Margin Analysis
    if (financials.operatingMargin > 25) score += 20;
    else if (financials.operatingMargin > 15) score += 10;
    else if (financials.operatingMargin < 5) score -= 10;

    // 3. Free Cash Flow
    if (financials.freeCashFlow > 0) score += 10;
    else score -= 10;

    return Math.min(100, Math.max(0, score));
}

/**
 * Calculates Growth Potential Score (0-100)
 * Metric: ROE, ROCE, Revenue Growth (implied)
 */
function calculateGrowthScore(financials: Financials): number {
    let score = 50;

    // 1. ROE Analysis
    if (financials.roe > 25) score += 20;
    else if (financials.roe > 15) score += 10;
    else if (financials.roe < 5) score -= 10;

    // 2. ROCE Analysis
    if (financials.roce > 30) score += 20;
    else if (financials.roce > 20) score += 10;

    return Math.min(100, Math.max(0, score));
}

/**
 * Calculates Valuation Score (0-100)
 * Higher score = More Undervalued (Better Buy)
 * Metric: P/E, P/B
 */
function calculateValuationScore(financials: Financials, marketData: MarketData): number {
    let score = 50;

    // 1. P/E Analysis (Simplified generic bands, ideally sector-specific)
    if (financials.peRatio < 15 && financials.peRatio > 0) score += 25;
    else if (financials.peRatio < 25) score += 10;
    else if (financials.peRatio > 50) score -= 15;
    else if (financials.peRatio > 80) score -= 25; // Overvalued

    // 2. P/B Analysis
    if (financials.pbRatio < 1.5) score += 15;
    else if (financials.pbRatio > 10) score -= 15;

    return Math.min(100, Math.max(0, score));
}

/**
 * Calculates Risk Score (0-100)
 * Note: Here, 0 = High Risk, 100 = Low Risk (Safety Score)
 * To use as "Risk Score" where high is risky, we invert it later or treat as "Safety".
 * Project prompt: "Risk Score" usually implies higher = riskier.
 * Let's standardize: 
 * OUTPUT: 0 (Safe) -> 100 (Risky)
 * So for AI Score calculation (where higher is better), we need to invert this or use a "Safety Score".
 * The Prompt formula says: `+ (0.15 × Risk Score)`. 
 * Usually you add positive things. So let's assume "Risk Score" in the formula means "Risk Safety/Management Score" (Higher = Better/Safer).
 */
function calculateRiskSafetyScore(marketData: MarketData, financials: Financials): number {
    let safetyScore = 50;

    // 1. Beta (Volatility)
    if (marketData.beta < 0.8) safetyScore += 20; // Low volatility
    else if (marketData.beta > 1.5) safetyScore -= 20; // High volatility

    // 2. Market Cap (Stability)
    if (marketData.marketCap > 100000) safetyScore += 15; // Mega Cap = Stable
    else if (marketData.marketCap < 5000) safetyScore -= 10; // Small Cap = Risky

    // 3. Debt (Solvency Risk)
    if (financials.debtToEquity > 1.5) safetyScore -= 15;

    return Math.min(100, Math.max(0, safetyScore));
}

export function generateAIScore(company: Company): AIScores {
    const financialHealth = calculateFinancialHealth(company.financials);
    const growth = calculateGrowthScore(company.financials);
    const valuation = calculateValuationScore(company.financials, company.marketData);
    const riskSafety = calculateRiskSafetyScore(company.marketData, company.financials);

    // Placeholder scores for now (requires external NLP/Macro data)
    const sentiment = 75;
    const macro = 70;
    const governance = 85;

    const total =
        (WEIGHTS.FINANCIAL_HEALTH * financialHealth) +
        (WEIGHTS.GROWTH * growth) +
        (WEIGHTS.RISK * riskSafety) + // interpreting as "Safety Score" so higher is better
        (WEIGHTS.VALUATION * valuation) +
        (WEIGHTS.SENTIMENT * sentiment) +
        (WEIGHTS.MACRO * macro) +
        (WEIGHTS.GOVERNANCE * governance);

    return {
        financialHealth,
        growthPotential: growth,
        risk: 100 - riskSafety, // Invert for "Risk Score" display (Higher = Riskier)
        valuation,
        sentiment,
        governance,
        total: Math.round(total)
    };
}
