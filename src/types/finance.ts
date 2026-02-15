export type AssetClass = "Equity" | "Debt" | "Commodity" | "RealEstate" | "Crypto";
export type Sector = "Technology" | "Finance" | "Energy" | "Healthcare" | "Consumer" | "Industrial" | "Utilities" | "Telecommunications";

export interface Financials {
    revenue: number; // in Crores
    netProfit: number; // in Crores
    eps: number;
    peRatio: number;
    pbRatio: number;
    debtToEquity: number;
    roe: number; // Return on Equity %
    roce: number; // Return on Capital Employed %
    dividendYield: number; // %
    operatingMargin: number; // %
    freeCashFlow: number; // in Crores
}

export interface MarketData {
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    high52Week: number;
    low52Week: number;
    marketCap: number; // in Crores
    beta: number; // Volatility measure
}

export interface AIScores {
    financialHealth: number; // 0-100
    growthPotential: number; // 0-100
    risk: number; // 0-100 (Lower is better, or Higher is riskier? Usually standardized to 0-100 score where 100 is best/safest or defined strictly. Let's say 100 is "High Risk")
    // Actually, let's normalize: 100 = Best/Positive.
    // So RiskScore: 100 = Very Low Risk (Safe), 0 = Very High Risk. 
    // Wait, "Risk Score" usually means higher = riskier. Let's stick to standard. 
    // RiskScore: 0 (Safe) - 100 (High Risk).
    valuation: number; // 0-100 (Higher is better/undervalued)
    sentiment: number; // 0-100
    governance: number; // 0-100
    total: number; // Weighted average (0-100)
}

export interface Company {
    id: string;
    symbol: string;
    name: string;
    sector: Sector;
    description: string;
    financials: Financials;
    marketData: MarketData;
    aiScore: AIScores;
    logoUrl?: string;
}

export interface UserInvestmentProfile {
    capital: number;
    durationYears: number;
    riskTolerance: "Conservative" | "Balanced" | "Growth" | "Aggressive";
    goals: string[]; // e.g. "Wealth Creation", "Passive Income"
}

export interface PortfolioAllocation {
    assetClass: AssetClass;
    percentage: number;
    amount: number;
}
