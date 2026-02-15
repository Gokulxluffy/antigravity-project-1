export interface SimulationPoint {
    year: number;
    conservative: number;
    balanced: number;
    aggressive: number;
}

export function runMonteCarloSimulation(initialCapital: number, years: number): SimulationPoint[] {
    const data: SimulationPoint[] = [];

    // Annual Return Assumptions (Mean, StdDev)
    // Conservative: 6%
    // Balanced: 10%
    // Aggressive: 15%

    let currentConservative = initialCapital;
    let currentBalanced = initialCapital;
    let currentAggressive = initialCapital;

    for (let i = 0; i <= years; i++) {
        data.push({
            year: new Date().getFullYear() + i,
            conservative: Math.round(currentConservative),
            balanced: Math.round(currentBalanced),
            aggressive: Math.round(currentAggressive),
        });

        // Apply Compound Growth (Simplified Deterministic for Visualization)
        // In a real Monte Carlo, we would run 1000s of iterations with random volatility.
        // For UI demo, we show the "Expected Mean Path".

        currentConservative *= 1.06;
        currentBalanced *= 1.10;
        currentAggressive *= 1.15;
    }

    return data;
}
