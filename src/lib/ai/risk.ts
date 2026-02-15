import { MarketData } from "@/types/finance";

export function calculateDrawdown(prices: number[]): number {
    let peak = -Infinity;
    let maxDrawdown = 0;

    for (const price of prices) {
        if (price > peak) {
            peak = price;
        }
        const drawdown = (peak - price) / peak;
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }
    }

    return maxDrawdown * 100; // Percentage
}

export function simulatePortfolioStress(
    portfolioValue: number,
    scenario: "market_crash" | "inflation_spike" | "tech_bubble"
): number {
    switch (scenario) {
        case "market_crash":
            return portfolioValue * 0.75; // -25%
        case "inflation_spike":
            return portfolioValue * 0.88; // -12%
        case "tech_bubble":
            return portfolioValue * 0.60; // -40% (if tech heavy)
        default:
            return portfolioValue;
    }
}
