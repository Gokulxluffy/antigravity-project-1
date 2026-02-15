'use client';
import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { use, useState, useMemo } from 'react';
import { allStocks } from '@/lib/stockData';
import { scoreStock } from '@/lib/scoringEngine';
import { makeDecision } from '@/lib/decisionEngine';
import { generateExplanation } from '@/lib/explainableAI';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, Building, BarChart3, PieChart, Users, ChevronLeft, Brain, FileText, Newspaper, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { ScoreRadar } from '@/components/VisualAnalytics';
import { VerdictBadge, AnimatedCounter, AnimatedBar, GlowCard, HUDMetricCard } from '@/components/AnimatedComponents';
import { ComplianceBar } from '@/components/ComplianceBar';

// ── Tabs Component ──
function Tabs({ tabs, active, onChange }: { tabs: string[], active: string, onChange: (t: string) => void }) {
    return (
        <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 24 }}>
            {tabs.map(t => (
                <button key={t} onClick={() => onChange(t)} style={{
                    padding: '12px 0', background: 'transparent', border: 'none',
                    color: active === t ? '#3b82f6' : 'rgba(255,255,255,0.6)',
                    fontWeight: active === t ? 600 : 400, fontSize: 14, cursor: 'pointer',
                    borderBottom: active === t ? '2px solid #3b82f6' : '2px solid transparent',
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6
                }}>
                    {t === 'Overview' && <BarChart3 size={16} />}
                    {t === 'AI Analysis' && <Brain size={16} />}
                    {t === 'Financials' && <FileText size={16} />}
                    {t}
                </button>
            ))}
        </div>
    );
}

export default function StockDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = use(params);
    const [activeTab, setActiveTab] = useState('Overview');

    const stock = allStocks.find(s => s.company.symbol === symbol);

    // Default context for general analysis
    const decisionContext = useMemo(() => ({
        capital: 500000,
        duration: 'medium' as const,
        risk: 'moderate' as const
    }), []);

    const analysis = useMemo(() => {
        if (!stock) return null;
        const score = scoreStock(stock);
        const decision = makeDecision(stock, decisionContext.capital, decisionContext.duration, decisionContext.risk);
        const explanation = generateExplanation(stock, score, decision);
        return { score, decision, explanation };
    }, [stock, decisionContext]);

    if (!stock || !analysis) {
        return (
            <DashboardLayout>
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Stock Not Found</h2>
                    <Link href="/dashboard" className="btn-primary">Back to Dashboard</Link>
                </div>
            </DashboardLayout>
        );
    }

    const { score, decision, explanation } = analysis;
    const s = stock;
    const priceChange = s.historicalPrices.length >= 2 ? s.historicalPrices[s.historicalPrices.length - 1] - s.historicalPrices[s.historicalPrices.length - 2] : 0;
    const isUp = priceChange >= 0;
    const priceData = s.historicalPrices.map((p, i) => ({ month: `M${i + 1}`, price: p }));

    const radarData = [
        { factor: 'Fundamental', score: score.fundamentalScore },
        { factor: 'Growth', score: score.growthScore },
        { factor: 'Risk', score: score.riskScore },
        { factor: 'Valuation', score: score.valuationScore },
        { factor: 'Stability', score: score.stabilityScore },
        { factor: 'Capital Eff.', score: score.capitalEfficiencyScore },
    ];

    return (
        <DashboardLayout>
            <div style={{ paddingBottom: 40 }}>
                {/* Back */}
                <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#8b95b3', fontSize: 13, textDecoration: 'none', marginBottom: 20 }}>
                    <ChevronLeft size={16} /> Back to Dashboard
                </Link>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 18, fontWeight: 700, color: 'white', background: 'linear-gradient(135deg,#6366f1,#a78bfa)',
                            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
                        }}>
                            {s.company.symbol.slice(0, 2)}
                        </div>
                        <div>
                            <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, lineHeight: 1 }}>{s.company.symbol}</h1>
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>{s.company.name}</div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)' }}>
                                    {s.company.sector}
                                </span>
                                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)' }}>
                                    {s.company.marketCapCategory.toUpperCase()} CAP
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 36, fontWeight: 700, color: '#fff' }}>
                            <span style={{ fontSize: 20, verticalAlign: 'top', marginRight: 2, color: 'rgba(255,255,255,0.5)' }}>₹</span>
                            <AnimatedCounter value={s.price.currentPrice} decimals={2} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', color: isUp ? '#10b981' : '#ef4444', fontSize: 15, fontWeight: 600 }}>
                            {isUp ? <ArrowUpRight size={18} /> : <TrendingDown size={18} />}
                            {isUp ? '+' : ''}{priceChange.toFixed(2)} ({((priceChange / s.price.currentPrice) * 100).toFixed(2)}%)
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <Tabs tabs={['Overview', 'AI Analysis', 'Financials']} active={activeTab} onChange={setActiveTab} />

                <AnimatePresence mode="wait">
                    {activeTab === 'Overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                                {/* Left Col */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    {/* Chart */}
                                    <div className="glass-card" style={{ padding: 24, height: 320 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>Price History</h3>
                                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Past 12 Months</div>
                                        </div>
                                        <div style={{ height: 240, width: '100%' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={priceData}>
                                                    <defs>
                                                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity={0.2} />
                                                            <stop offset="100%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                    <XAxis dataKey="month" hide />
                                                    <YAxis domain={['auto', 'auto']} hide />
                                                    <Tooltip
                                                        contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                                                        formatter={(val: number) => [`₹${val.toFixed(2)}`, 'Price']}
                                                    />
                                                    <Area type="monotone" dataKey="price" stroke={isUp ? '#10b981' : '#ef4444'} strokeWidth={2} fill="url(#chartGrad)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Key Fundamentals */}
                                    <div className="glass-card" style={{ padding: 24 }}>
                                        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: '#fff' }}>Fundamentals</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                                            {[
                                                { label: 'P/E Ratio', value: s.price.pe.toFixed(1) },
                                                { label: 'P/B Ratio', value: s.price.pb.toFixed(1) },
                                                { label: 'ROE', value: s.financials.roe + '%' },
                                                { label: 'Div Yield', value: s.financials.dividendYield + '%' },
                                                { label: 'Market Cap', value: formatCurrency(s.company.marketCap) + 'Cr' },
                                                { label: 'Debt/Eq', value: s.financials.debtToEquity.toFixed(2) },
                                                { label: 'EPS', value: '₹' + s.financials.eps },
                                                { label: 'Book Value', value: '₹' + s.financials.bookValue },
                                            ].map((item, i) => (
                                                <div key={i} style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
                                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{item.label}</div>
                                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{item.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Col: AI Verdict */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>AI Verdict</h3>
                                        <VerdictBadge verdict={decision.verdict} grade={decision.overallGrade} confidence={decision.confidencePercent} />

                                        <div style={{ width: '100%', marginTop: 24, display: 'grid', gap: 12 }}>
                                            <AnimatedBar label="Return Potential" value={decision.returnPotentialScore} color="#10b981" />
                                            <AnimatedBar label="Risk Safety" value={100 - decision.riskScore} color="#3b82f6" />
                                        </div>
                                    </div>

                                    <div className="glass-card" style={{ padding: 24 }}>
                                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Score Radar</h3>
                                        <ScoreRadar scores={radarData} size={200} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'AI Analysis' && (
                        <motion.div key="analysis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Brain size={18} color="#8b5cf6" /> AI Logic & Reasoning
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {explanation.logicalReasoning.map((r, i) => (
                                            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                                                <CheckCircle2 size={16} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
                                                {r}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <AlertTriangle size={18} color="#f59e0b" /> Risk Assessment
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {decision.riskJustification.map((r, i) => (
                                            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                                                <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                                                {r}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'Financials' && (
                        <motion.div key="financials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <div className="glass-card" style={{ padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                                Detailed financial statements (P&L, Balance Sheet, Cash Flow) would appear here.
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ marginTop: 40 }}>
                    <ComplianceBar />
                </div>
            </div>
        </DashboardLayout>
    );
}
