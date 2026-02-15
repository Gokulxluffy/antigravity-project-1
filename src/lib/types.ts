// ============================================================
// AI Investment Intelligence Platform — Core Type Definitions
// ============================================================

export type RiskLevel = 'conservative' | 'moderate' | 'aggressive';
export type TimePeriod = 'short' | 'medium' | 'long';
export type Exchange = 'NSE' | 'BSE' | 'NSE/BSE';
export type MarketCap = 'large' | 'mid' | 'small';

export interface Company {
  id: string;
  name: string;
  symbol: string;
  exchange: Exchange;
  sector: string;
  industry: string;
  marketCap: number;       // in Cr
  marketCapCategory: MarketCap;
  description: string;
  founded: number;
  headquarters: string;
}

export interface FinancialData {
  revenue: number;         // in Cr
  revenueGrowth: number;   // %
  netProfit: number;       // in Cr
  netProfitMargin: number; // %
  ebitda: number;          // in Cr
  operatingMargin: number; // %
  totalDebt: number;       // in Cr
  totalEquity: number;     // in Cr
  totalAssets: number;     // in Cr
  freeCashFlow: number;    // in Cr
  eps: number;             // ₹
  epsGrowth: number;       // %
  dividendYield: number;   // %
  bookValue: number;       // ₹
  roe: number;             // %
  roce: number;            // %
  debtToEquity: number;    // ratio
  interestCoverage: number;
  currentRatio: number;
  assetTurnover: number;
  revenueCAGR3Y: number;   // %
  profitCAGR3Y: number;    // %
}

export interface PriceData {
  currentPrice: number;
  weekHigh52: number;
  weekLow52: number;
  pe: number;
  pb: number;
  pegRatio: number;
  beta: number;
  avgVolume: number;
  marketCapValue: number;
  freeFloat: number;      // %
}

export interface HoldingData {
  promoterHolding: number;     // %
  fiiHolding: number;          // %
  diiHolding: number;          // %
  publicHolding: number;       // %
  pledgedPercentage: number;   // %
}

export interface StockData {
  company: Company;
  financials: FinancialData;
  price: PriceData;
  holdings: HoldingData;
  historicalPrices: number[];  // last 12 months closing prices
}

export interface ScoreBreakdown {
  fundamentalScore: number;   // 0-100
  growthScore: number;        // 0-100
  riskScore: number;          // 0-100
  valuationScore: number;     // 0-100
  liquidityScore: number;     // 0-100
  compositeScore: number;     // weighted 0-100
  reasoning: string[];
}

export interface StockRecommendation {
  stock: StockData;
  score: ScoreBreakdown;
  allocatedCapital: number;   // ₹
  allocatedPercentage: number; // %
  expectedReturn: number;     // %
  riskRating: RiskLevel;
  confidenceScore: number;    // 0-100
  rationale: string;
  keyStrengths: string[];
  keyRisks: string[];
}

export interface PortfolioAllocation {
  totalCapital: number;
  investmentDuration: TimePeriod;
  riskProfile: RiskLevel;
  recommendations: StockRecommendation[];
  sectorAllocation: Record<string, number>;  // sector -> %
  capAllocation: Record<MarketCap, number>;  // cap -> %
  expectedPortfolioReturn: number;
  portfolioRiskScore: number;
  confidenceIndex: number;
  diversificationScore: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  riskProfile: RiskLevel;
  capital: number;
  duration: TimePeriod;
  investmentGoal: string;
}

export interface MarketOverview {
  nifty50: number;
  nifty50Change: number;
  sensex: number;
  sensexChange: number;
  niftyBank: number;
  niftyBankChange: number;
  niftyIT: number;
  niftyITChange: number;
  marketBreadth: { advances: number; declines: number; unchanged: number };
  topGainers: { symbol: string; change: number }[];
  topLosers: { symbol: string; change: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ============================================================
// Extended Types for 15-Module Intelligence Expansion
// ============================================================

export type DecisionVerdict = 'INVEST' | 'DO NOT INVEST';

// Include 4 — Enhanced 8-factor scoring
export interface EnhancedScoreBreakdown extends ScoreBreakdown {
  stabilityScore: number;       // 0-100 market stability
  volatilityScore: number;      // 0-100 volatility profile (higher = less volatile)
  capitalEfficiencyScore: number; // 0-100 capital efficiency
  factorWeights: Record<string, number>;
}

// Include 1 — Decision Engine output
export interface InvestmentDecision {
  verdict: DecisionVerdict;
  confidencePercent: number;       // 0-100
  riskJustification: string[];
  returnPotentialScore: number;    // 0-100
  timeHorizonSuitability: number;  // 0-100
  capitalEfficiency: number;       // 0-100
  portfolioFitScore: number;       // 0-100
  overallGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  summary: string;
}

// Include 8 — Explainable AI
export interface ExplainableResult {
  logicalReasoning: string[];
  financialJustification: string[];
  scoreBreakdown: { factor: string; score: number; weight: number; contribution: number; explanation: string }[];
  riskExplanation: string[];
  returnRationale: string[];
  forecastReasoning: string[];
  dataTransparency: { metric: string; value: string; source: string }[];
  auditTrail: { step: string; input: string; output: string; timestamp: string }[];
}

// Include 9 — Advisory Report
export interface AdvisoryReport {
  investmentStrategy: string;
  capitalDeploymentPlan: { phase: string; percentage: number; description: string }[];
  riskAdjustedRecommendations: { action: string; reason: string; priority: 'high' | 'medium' | 'low' }[];
  timeBasedStrategy: { horizon: string; strategy: string; expectedOutcome: string }[];
  portfolioAlignment: { metric: string; current: number; target: number; status: 'aligned' | 'misaligned' | 'partial' }[];
  marketConditionAnalysis: { factor: string; status: 'bullish' | 'bearish' | 'neutral'; impact: string }[];
  financialObjectiveAlignment: number; // 0-100
}

// Include 2 — Live Market
export interface LiveMarketTick {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
  bid: number;
  ask: number;
  dayHigh: number;
  dayLow: number;
}

export interface LiveIndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

// Include 5 — Data Pipeline
export type PipelineStageName = 'ingestion' | 'cleaning' | 'normalization' | 'validation' | 'featureEngineering' | 'scoring' | 'dashboard';

export interface PipelineStage {
  name: PipelineStageName;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;          // 0-100
  recordsProcessed: number;
  lastUpdated: number;       // timestamp
  errorCount: number;
}

export interface PipelineStatus {
  stages: PipelineStage[];
  overallHealth: 'healthy' | 'degraded' | 'critical';
  throughput: number;         // records/sec
  uptime: number;             // %
  lastFullSync: number;       // timestamp
}

// Include 14 — Continuous Learning
export interface AIModelState {
  version: string;
  accuracy: number;           // %
  lastRetrained: string;      // ISO date
  improvementHistory: { version: string; accuracy: number; date: string }[];
  retrainTrigger: string;
  nextScheduledRetrain: string;
  activeFeatures: number;
  totalPredictions: number;
  predictionAccuracy7d: number;
  modelType: string;
}

// Include 10 — Compliance
export interface ComplianceDisclaimer {
  id: string;
  type: 'risk' | 'advisory' | 'regulatory' | 'data' | 'ai' | 'market';
  title: string;
  content: string;
  severity: 'info' | 'warning' | 'critical';
  mandatory: boolean;
  regulatoryBody?: string;
}

// Include 7 — Enhanced Portfolio
export interface RebalanceSignal {
  stockSymbol: string;
  currentAllocation: number;
  targetAllocation: number;
  action: 'buy' | 'sell' | 'hold';
  quantity: number;
  reason: string;
}

export interface CorrelationPair {
  stockA: string;
  stockB: string;
  correlation: number;       // -1 to 1
  riskImpact: 'reduces' | 'increases' | 'neutral';
}
