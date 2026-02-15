import { Company } from '@/types/finance';
import { generateAIScore } from "../ai/scoring";

const RELIANCE_FINANCIALS = {
    revenue: 892944,
    netProfit: 73670,
    eps: 108.9,
    peRatio: 28.4,
    pbRatio: 2.1,
    debtToEquity: 0.42,
    roe: 9.8,
    roce: 11.2,
    dividendYield: 0.3,
    operatingMargin: 18.5,
    freeCashFlow: 35000
};

const RELIANCE_MARKET = {
    price: 2985.40,
    change: 12.5,
    changePercent: 0.42,
    volume: 4500000,
    high52Week: 3025,
    low52Week: 2200,
    marketCap: 2020000,
    beta: 1.05
};

const TCS_FINANCIALS = {
    revenue: 240893,
    netProfit: 46099,
    eps: 125.4,
    peRatio: 32.1,
    pbRatio: 14.5,
    debtToEquity: 0.0,
    roe: 48.2,
    roce: 59.5,
    dividendYield: 1.2,
    operatingMargin: 24.6,
    freeCashFlow: 42000
};

const TCS_MARKET = {
    price: 4120.75,
    change: -15.2,
    changePercent: -0.37,
    volume: 2100000,
    high52Week: 4250,
    low52Week: 3300,
    marketCap: 1510000,
    beta: 0.65
};

const HDFC_FINANCIALS = {
    revenue: 296458,
    netProfit: 60348,
    eps: 79.5,
    peRatio: 18.2,
    pbRatio: 2.8,
    debtToEquity: 0.0,
    roe: 17.1,
    roce: 15.5,
    dividendYield: 1.1,
    operatingMargin: 35.2,
    freeCashFlow: 0
};

const HDFC_MARKET = {
    price: 1450.30,
    change: 8.4,
    changePercent: 0.58,
    volume: 12000000,
    high52Week: 1750,
    low52Week: 1380,
    marketCap: 1105000,
    beta: 0.95
};

const INFY_FINANCIALS = {
    revenue: 153000,
    netProfit: 26000,
    eps: 62.8,
    peRatio: 24.5,
    pbRatio: 7.8,
    debtToEquity: 0.0,
    roe: 31.5,
    roce: 40.2,
    dividendYield: 1.8,
    operatingMargin: 21.0,
    freeCashFlow: 22000
};

const INFY_MARKET = {
    price: 1540.00,
    change: 22.0,
    changePercent: 1.45,
    volume: 3500000,
    high52Week: 1700,
    low52Week: 1350,
    marketCap: 640000,
    beta: 0.85
};

const ICICI_FINANCIALS = {
    revenue: 186000,
    netProfit: 40000,
    eps: 58.2,
    peRatio: 18.5,
    pbRatio: 3.2,
    debtToEquity: 0.0,
    roe: 18.5,
    roce: 16.8,
    dividendYield: 0.8,
    operatingMargin: 32.0,
    freeCashFlow: 0
};

const ICICI_MARKET = {
    price: 1080.50,
    change: 5.5,
    changePercent: 0.51,
    volume: 9800000,
    high52Week: 1150,
    low52Week: 900,
    marketCap: 758000,
    beta: 1.10
};

export const MOCK_COMPANIES: Company[] = [
    {
        id: "1",
        symbol: "RELIANCE",
        name: "Reliance Industries Ltd",
        sector: "Energy",
        description: "Reliance Industries Limited is an Indian multinational conglomerate headquartered in Mumbai. Its businesses include energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles.",
        financials: RELIANCE_FINANCIALS,
        marketData: RELIANCE_MARKET,
        aiScore: generateAIScore({ financials: RELIANCE_FINANCIALS, marketData: RELIANCE_MARKET } as Company)
    },
    {
        id: "2",
        symbol: "TCS",
        name: "Tata Consultancy Services",
        sector: "Technology",
        description: "TCS is an Indian multinational information technology services and consulting company headquartered in Mumbai.",
        financials: TCS_FINANCIALS,
        marketData: TCS_MARKET,
        aiScore: generateAIScore({ financials: TCS_FINANCIALS, marketData: TCS_MARKET } as Company)
    },
    {
        id: "3",
        symbol: "HDFCBANK",
        name: "HDFC Bank Ltd",
        sector: "Finance",
        description: "HDFC Bank Limited is an Indian banking and financial services company headquartered in Mumbai.",
        financials: HDFC_FINANCIALS,
        marketData: HDFC_MARKET,
        aiScore: generateAIScore({ financials: HDFC_FINANCIALS, marketData: HDFC_MARKET } as Company)
    },
    {
        id: "4",
        symbol: "INFY",
        name: "Infosys Ltd",
        sector: "Technology",
        description: "Infosys Limited is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services.",
        financials: INFY_FINANCIALS,
        marketData: INFY_MARKET,
        aiScore: generateAIScore({ financials: INFY_FINANCIALS, marketData: INFY_MARKET } as Company)
    },
    {
        id: "5",
        symbol: "ICICIBANK",
        name: "ICICI Bank Ltd",
        sector: "Finance",
        description: "ICICI Bank Limited is an Indian multinational bank and financial services company headquartered in Mumbai.",
        financials: ICICI_FINANCIALS,
        marketData: ICICI_MARKET,
        aiScore: generateAIScore({ financials: ICICI_FINANCIALS, marketData: ICICI_MARKET } as Company)
    }
];
