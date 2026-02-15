'use client';
import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { generateRecommendations } from '@/lib/recommendationEngine';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { RiskLevel, TimePeriod } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { TrendingUp, Shield, Target, ArrowUpRight, ChevronRight, Star, Zap, Filter, ChevronDown, CheckCircle2, AlertTriangle } from 'lucide-react';
import { GlowCard, AnimatedCounter, StaggerList, StaggerItem, HUDMetricCard } from '@/components/AnimatedComponents';
import { ComplianceBar } from '@/components/ComplianceBar';

const COLORS = ['#6366f1', '#34d399', '#38bdf8', '#a78bfa', '#fb7185', '#fbbf24', '#f472b6', '#22d3ee', '#818cf8', '#a3e635'];

function RecommendationsInner() {
    const params = useSearchParams();
    const capital = Number(params.get('capital') || 500000);
    const duration = (params.get('duration') || 'medium') as TimePeriod;
    const risk = (params.get('risk') || 'moderate') as RiskLevel;

    // Local State for Filtering
    const [selectedSector, setSelectedSector] = useState<string>('All');
    const [expandedRec, setExpandedRec] = useState<string | null>(null);

    const portfolio = useMemo(() => generateRecommendations(capital, duration, risk), [capital, duration, risk]);
    const allRecs = portfolio.recommendations;

    // Filter Logic
    const filteredRecs = useMemo(() => {
        if (selectedSector === 'All') return allRecs;
        return allRecs.filter(r => r.stock.company.sector === selectedSector);
    }, [allRecs, selectedSector]);

    const sectors = ['All', ...Array.from(new Set(allRecs.map(r => r.stock.company.sector)))];
    const sectorData = Object.entries(portfolio.sectorAllocation).map(([name, value]) => ({ name, value }));

    return (
        <>
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>AI Investment Strategy</h1>
                        <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                            <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.05)' }}>{formatCurrency(capital)}</span>
                            <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', textTransform: 'capitalize' }}>{duration} Term</span>
                            <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', textTransform: 'capitalize' }}>{risk} Risk</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* HUD Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                <HUDMetricCard label="Expected Return" value={portfolio.expectedPortfolioReturn} unit="%" icon={<TrendingUp size={16} color="#10b981" />} />
                <HUDMetricCard label="Risk Score" value={portfolio.portfolioRiskScore} unit="/100" icon={<Shield size={16} color="#f59e0b" />} />
                <HUDMetricCard label="Confidence" value={portfolio.confidenceIndex} unit="%" icon={<Target size={16} color="#3b82f6" />} />
                <HUDMetricCard label="Total Stocks" value={allRecs.length} unit="" icon={<Star size={16} color="#8b5cf6" />} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 24 }}>
                {/* Main List */}
                <div>
                    {/* Toolbar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Zap size={18} color="#f59e0b" /> Top Picks
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Filter size={14} color="rgba(255,255,255,0.5)" />
                            <select
                                value={selectedSector}
                                onChange={e => setSelectedSector(e.target.value)}
                                style={{
                                    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff', fontSize: 12, padding: '6px 10px', borderRadius: 6, outline: 'none'
                                }}
                            >
                                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <StaggerList style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filteredRecs.map((rec, i) => (
                            <StaggerItem key={rec.stock.company.symbol}>
                                <div style={{ position: 'relative' }}>
                                    <GlowCard
                                        onClick={() => setExpandedRec(expandedRec === rec.stock.company.symbol ? null : rec.stock.company.symbol)}
                                        style={{ padding: 20, cursor: 'pointer', transition: 'all 0.2s', background: expandedRec === rec.stock.company.symbol ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                <div style={{
                                                    width: 48, height: 48, borderRadius: 14,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 14, fontWeight: 700, color: 'white',
                                                    background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})`,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                                }}>
                                                    {rec.stock.company.symbol.slice(0, 2)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: 16, color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        {rec.stock.company.symbol}
                                                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}>{rec.stock.company.sector}</span>
                                                    </div>
                                                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{rec.stock.company.name}</div>
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: 24 }}>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Score</div>
                                                        <div style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>{rec.score.compositeScore}</div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Exp. Return</div>
                                                        <div style={{ fontSize: 18, fontWeight: 700, color: '#3b82f6' }}>{rec.expectedReturn}%</div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <motion.div animate={{ rotate: expandedRec === rec.stock.company.symbol ? 180 : 0 }}>
                                                            <ChevronDown size={20} color="rgba(255,255,255,0.3)" />
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Stats Grid */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div>
                                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Allocation</div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{rec.allocatedPercentage}%</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Amount</div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{formatCurrency(rec.allocatedCapital, true)}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Price</div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>₹{formatNumber(rec.stock.price.currentPrice)}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Confidence</div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa' }}>{rec.confidenceScore}%</div>
                                            </div>
                                        </div>

                                        {/* Expandable Reasoning */}
                                        <AnimatePresence>
                                            {expandedRec === rec.stock.company.symbol && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                    style={{ overflow: 'hidden', marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}
                                                >
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                                        <div>
                                                            <div style={{ fontSize: 12, fontWeight: 600, color: '#10b981', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                <CheckCircle2 size={14} /> Buy Rationale
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                                {rec.keyStrengths.map((s, idx) => (
                                                                    <div key={idx} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'flex', gap: 8 }}>
                                                                        <span style={{ width: 4, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)', marginTop: 8 }} />
                                                                        {s}
                                                                    </div>
                                                                ))}
                                                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'flex', gap: 8 }}>
                                                                    <span style={{ width: 4, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)', marginTop: 8 }} />
                                                                    {rec.rationale}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                <AlertTriangle size={14} /> Risk Factors
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                                {rec.keyRisks.map((r, idx) => (
                                                                    <div key={idx} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'flex', gap: 8 }}>
                                                                        <span style={{ width: 4, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.3)', marginTop: 8 }} />
                                                                        {r}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <Link href={`/stock/${rec.stock.company.symbol}`} style={{ display: 'inline-block', marginTop: 16, fontSize: 12, color: '#3b82f6', textDecoration: 'none' }}>
                                                                View Deep Dive Analysis →
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </GlowCard>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerList>
                </div>

                {/* Sidebar Charts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="glass-card" style={{ padding: 20 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#fff' }}>Sector Weightage</h3>
                        <div style={{ height: 200, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={sectorData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                                        {sectorData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8, fontSize: 12 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                            {sectorData.map((s, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                                    <div style={{ width: 6, height: 6, borderRadius: 3, background: COLORS[i % COLORS.length] }} />
                                    {s.name} ({s.value}%)
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link href="/portfolio" className="btn-primary" style={{ textAlign: 'center', padding: '12px', fontSize: 13, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}>
                        Build This Portfolio
                    </Link>
                </div>
            </div>

            <div style={{ marginTop: 40 }}>
                <ComplianceBar />
            </div>
        </>
    );
}

export default function RecommendationsPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.5)' }}>Analyzing market data...</div>}>
                <RecommendationsInner />
            </Suspense>
        </DashboardLayout>
    );
}
