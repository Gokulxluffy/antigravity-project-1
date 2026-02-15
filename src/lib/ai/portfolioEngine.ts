import { Company, UserInvestmentProfile, PortfolioAllocation, AssetClass } from "@/types/finance";
import { MOCK_COMPANIES } from "@/lib/data/mockData";

export interface InvestmentDecision {
    shouldInvest: boolean;
    confidenceScore: number;
    reasoning: string[];
    allocations: PortfolioAllocation[];
    selectedStocks: Company[];
}

export function generatePortfolio(profile: UserInvestmentProfile): InvestmentDecision {
    // 1. Determine Asset Allocation based on Risk
    const allocations = getAssetAllocation(profile.riskTolerance);

    // 2. Select Stocks based on Risk & AI Score
    // Logic: 
    // - Conservative: High Health, Low Volatility
    // - Aggressive: High Growth, High AI Score
    const selectedStocks = selectStocks(profile.riskTolerance);

    // 3. Compute Confidence Score
    // Average AI Score of selected stocks weighted by equity allocation
    const avgStockScore = selectedStocks.reduce((sum, stock) => sum + stock.aiScore.total, 0) / selectedStocks.length;
    const confidenceScore = Math.round(avgStockScore); // Simple simplified metrics

    // 4. Make Decision
    // If Confidence > 70 => Invest
    const shouldInvest = confidenceScore > 70;

    // 5. Generate Reasoning
    const reasoning = [
        `AI Confidence Score is ${confidenceScore}/100 based on ${profile.riskTolerance} parameters.`,
        `Selected ${selectedStocks.length} high-conviction assets with strong ${profile.riskTolerance === "Aggressive" ? "Growth" : "Fundamentals"}.`,
        shouldInvest ? "Market conditions are favorable for entry." : "Market conditions suggest caution."
    ];

    return {
        shouldInvest,
        confidenceScore,
        reasoning,
        allocations,
        selectedStocks
    };
}

function getAssetAllocation(risk: string): PortfolioAllocation[] {
    switch (risk) {
        case "Conservative":
            return [
                { assetClass: "Equity", percentage: 30, amount: 0 },
                { assetClass: "Debt", percentage: 50, amount: 0 },
                { assetClass: "Gold", percentage: 10, amount: 0 },
                { assetClass: "Cash", percentage: 10, amount: 0 }
            ];
        case "Balanced":
            return [
                { assetClass: "Equity", percentage: 50, amount: 0 },
                { assetClass: "Debt", percentage: 30, amount: 0 },
                { assetClass: "Gold", percentage: 10, amount: 0 },
                { assetClass: "Cash", percentage: 10, amount: 0 }
            ];
        case "Growth":
            return [
                { assetClass: "Equity", percentage: 70, amount: 0 },
                { assetClass: "Debt", percentage: 15, amount: 0 },
                { assetClass: "Gold", percentage: 10, amount: 0 },
                { assetClass: "Cash", percentage: 5, amount: 0 }
            ];
        case "Aggressive":
            return [
                { assetClass: "Equity", percentage: 90, amount: 0 },
                { assetClass: "Debt", percentage: 5, amount: 0 },
                { assetClass: "Crypto", percentage: 5, amount: 0 },
                { assetClass: "Cash", percentage: 0, amount: 0 }
            ];
        default:
            return [];
    }
}

function selectStocks(risk: string): Company[] {
    let sorted = [...MOCK_COMPANIES];

    if (risk === "Conservative") {
        // Sort by Financial Health & Risk (Safety)
        sorted.sort((a, b) => (b.aiScore.financialHealth + (100 - b.aiScore.risk)) - (a.aiScore.financialHealth + (100 - a.aiScore.risk)));
    } else if (risk === "Aggressive") {
        // Sort by Growth & Total AI Score
        sorted.sort((a, b) => (b.aiScore.growthPotential + b.aiScore.total) - (a.aiScore.growthPotential + a.aiScore.total));
    } else {
        // Balanced: Sort by Total AI Score
        sorted.sort((a, b) => b.aiScore.total - a.aiScore.total);
    }

    return sorted.slice(0, 3); // Pick Top 3
}
