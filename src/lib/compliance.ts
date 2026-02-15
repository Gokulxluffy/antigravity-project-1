// ============================================================
// Compliance & Risk Governance Layer (Include 10)
// Legally safe, transparent, regulation-aware
// ============================================================
import { ComplianceDisclaimer } from './types';

export const DISCLAIMERS: ComplianceDisclaimer[] = [
    {
        id: 'risk-001',
        type: 'risk',
        title: 'Investment Risk Disclaimer',
        content: 'Investments in securities markets are subject to market risks. The value of investments and the income derived from them can go down as well as up. Past performance is not indicative of future results. Read all scheme related documents carefully before investing.',
        severity: 'critical',
        mandatory: true,
        regulatoryBody: 'SEBI',
    },
    {
        id: 'ai-001',
        type: 'ai',
        title: 'AI Advisory Disclaimer',
        content: 'The AI-generated recommendations and scores on this platform are based on algorithmic analysis of publicly available financial data. These do not constitute personalized financial advice. The AI system may have limitations and biases inherent in its training data.',
        severity: 'critical',
        mandatory: true,
    },
    {
        id: 'market-001',
        type: 'market',
        title: 'Market Risk Disclosure',
        content: 'Stock market investments carry inherent risks including but not limited to: market risk, liquidity risk, credit risk, interest rate risk, currency risk, and geopolitical risk. The Indian securities market is regulated by SEBI and subject to its rules and regulations.',
        severity: 'warning',
        mandatory: true,
        regulatoryBody: 'SEBI',
    },
    {
        id: 'advisory-001',
        type: 'advisory',
        title: 'Non-Guarantee Clause',
        content: 'InvestIQ does not guarantee any returns on investments. All projections, expected returns, and AI scores are estimates based on historical data and mathematical models. Actual returns may differ materially from projected returns.',
        severity: 'critical',
        mandatory: true,
    },
    {
        id: 'regulatory-001',
        type: 'regulatory',
        title: 'Regulatory Compliance',
        content: 'This platform operates in compliance with SEBI (Investment Advisers) Regulations, 2013. Users should verify the registration status of any investment advisor. This platform provides technology-based analytical tools and does not hold SEBI IA registration.',
        severity: 'info',
        mandatory: false,
        regulatoryBody: 'SEBI',
    },
    {
        id: 'data-001',
        type: 'data',
        title: 'Data Usage & Privacy',
        content: 'Your financial data and investment preferences are processed securely for the purpose of generating personalized recommendations. We do not share your personal financial data with third parties. Data is encrypted at rest and in transit.',
        severity: 'info',
        mandatory: false,
    },
    {
        id: 'ai-002',
        type: 'ai',
        title: 'Ethical AI Compliance',
        content: 'Our AI models are designed with fairness, transparency, and accountability principles. All AI decisions provide explainable reasoning. The system undergoes regular bias audits and model performance reviews.',
        severity: 'info',
        mandatory: false,
    },
    {
        id: 'risk-002',
        type: 'risk',
        title: 'Concentration Risk Warning',
        content: 'Concentrated exposure to single stocks, sectors, or market segments increases portfolio risk. The platform recommends diversified portfolios but the final investment decision rests with the investor.',
        severity: 'warning',
        mandatory: false,
    },
];

// ── Get mandatory disclaimers ──
export function getMandatoryDisclaimers(): ComplianceDisclaimer[] {
    return DISCLAIMERS.filter(d => d.mandatory);
}

// ── Get disclaimers by type ──
export function getDisclaimersByType(type: ComplianceDisclaimer['type']): ComplianceDisclaimer[] {
    return DISCLAIMERS.filter(d => d.type === type);
}

// ── Get critical disclaimers ──
export function getCriticalDisclaimers(): ComplianceDisclaimer[] {
    return DISCLAIMERS.filter(d => d.severity === 'critical');
}

// ── Generate consent text ──
export function generateConsentText(): string {
    return 'By proceeding, I acknowledge that: (1) I have read and understood all risk disclaimers; ' +
        '(2) The AI-generated recommendations do not constitute personalized financial advice; ' +
        '(3) Past performance does not guarantee future results; ' +
        '(4) I am solely responsible for my investment decisions; ' +
        '(5) I understand the risks associated with investing in securities markets.';
}

// ── SEBI-style footer disclaimer ──
export function getFooterDisclaimer(): string {
    return 'Mutual fund investments are subject to market risks. Read all scheme related documents carefully before investing. ' +
        'The AI scores and projections are based on algorithmic analysis and do not guarantee returns. ' +
        'Investments in securities are subject to market risk. Please read the Risk Disclosure documents carefully before investing. ' +
        'Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.';
}
