'use client';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { generateRecommendations } from '@/lib/recommendationEngine';
import { calculatePortfolioVolatility } from '@/lib/portfolioEngine';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { ShieldAlert, AlertTriangle, TrendingDown, Activity, Zap, Thermometer, Anchor } from 'lucide-react';
import { AnimatedCounter, GlowCard, HUDMetricCard, PulseIndicator, AnimatedBar } from '@/components/AnimatedComponents';
import { ComplianceBar } from '@/components/ComplianceBar';

export default function RiskPage() {
    // Simulated Context
    const portfolio = useMemo(() => generateRecommendations(1000000, 'medium', 'moderate'), []);
    const volStats = useMemo(() => calculatePortfolioVolatility(portfolio), [portfolio]);

    // Risk Metrics
    const var95 = portfolio.totalCapital * (volStats.volatility / 100) * 1.645; // Simple parametric VaR
    const var99 = portfolio.totalCapital * (volStats.volatility / 100) * 2.33;

    // Stress Scenarios
    const scenarios = [
        { name: 'Market Correction', drop: -10, probability: 'High', description: 'Standard market pullback' },
        { name: 'Global Recession', drop: -25, probability: 'Low', description: 'Severe economic contraction' },
        { name: 'Rate Hike Shock', drop: -15, probability: 'Med', description: 'Central bank tightening' },
        { name: 'Sector Rotation', drop: -5, probability: 'High', description: 'Capital flow to defensive' },
    ];

    const [activeScenario, setActiveScenario] = useState(0);

    // Drawdown Simulation
    const drawdownData = Array.from({ length: 20 }, (_, i) => {
        const val = -Math.abs(Math.sin(i * 0.5) * (volStats.volatility / 2) * (Math.random() + 0.5));
        return { day: `Day ${i + 1}`, drawdown: val.toFixed(2) };
    });

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Risk Intelligence</h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldAlert size={16} color="#fbbf24" /> Advanced Portfolio Stress Testing & Analytics
                </p>
            </div>

            {/* HUD Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                <HUDMetricCard label="Value at Risk (95%)" value={formatCurrency(var95)} unit="" icon={<ShieldAlert size={16} color="#f59e0b" />} />
                <HUDMetricCard label="Max Drawdown" value="-12.4" unit="%" icon={<TrendingDown size={16} color="#ef4444" />} />
                <HUDMetricCard label="Beta" value={volStats.beta} unit="" icon={<Activity size={16} color="#3b82f6" />} />
                <HUDMetricCard label="Volatility" value={volStats.volatility} unit="%" icon={<Zap size={16} color="#a78bfa" />} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
                {/* Stress Testing Lab */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Thermometer size={18} color="#ef4444" /> Stress Test Simulator
                        </h3>
                        <div style={{ fontSize: 12, color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '2px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <PulseIndicator active color="#ef4444" size={6} /> Simulation Active
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {scenarios.map((s, i) => (
                                <button key={i} onClick={() => setActiveScenario(i)} style={{
                                    textAlign: 'left', padding: '12px', borderRadius: 10,
                                    background: activeScenario === i ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${activeScenario === i ? '#ef4444' : 'transparent'}`,
                                    cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 2
                                }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: activeScenario === i ? '#fff' : 'rgba(255,255,255,0.7)' }}>{s.name}</div>
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Prob: {s.probability}</div>
                                </button>
                            ))}
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Projected Portfolio Impact</div>
                            <motion.div
                                key={activeScenario}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{ fontSize: 36, fontWeight: 700, color: '#ef4444', marginBottom: 4 }}
                            >
                                {(scenarios[activeScenario].drop * volStats.beta).toFixed(1)}%
                            </motion.div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>
                                {formatCurrency(portfolio.totalCapital * (scenarios[activeScenario].drop * volStats.beta / 100))} Loss
                            </div>
                            <div style={{ fontSize: 12, lineHeight: 1.5, color: 'rgba(255,255,255,0.5)', maxWidth: '80%' }}>
                                Scenario: {scenarios[activeScenario].description}. <br />
                                Your portfolio beta of {volStats.beta} suggests slight cushion vs market.
                            </div>
                        </div>
                    </div>
                </div>

                {/* VaR Gauge */}
                <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 20 }}>1-Day Value at Risk (95%)</h3>
                    <div style={{ position: 'relative', width: 220, height: 110, marginBottom: 20 }}>
                        <div style={{
                            width: 220, height: 220, borderRadius: '50%',
                            border: '20px solid rgba(255,255,255,0.05)',
                            borderBottomColor: 'transparent', borderRightColor: 'transparent',
                            transform: 'rotate(-45deg)', position: 'absolute'
                        }} />
                        <motion.div
                            initial={{ rotate: -45 }}
                            animate={{ rotate: -45 + (1.8 * 65) }} // Demo value 65/100 risk
                            transition={{ duration: 1, type: 'spring' }}
                            style={{
                                width: 220, height: 220, borderRadius: '50%',
                                border: '20px solid transparent',
                                borderTopColor: '#f59e0b',
                                transform: 'rotate(-45deg)', position: 'absolute',
                                clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' // Half circle clip
                            }}
                        />
                        <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{formatCurrency(var95)}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Potential Daily Loss</div>
                        </div>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 10 }}>
                        There is a 5% chance your portfolio could lose more than this amount in a single day.
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Drawdown Chart */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Anchor size={18} color="#3b82f6" /> Historical Drawdown Simulation
                    </h3>
                    <div style={{ height: 240, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={drawdownData}>
                                <defs>
                                    <linearGradient id="drawdownGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="day" hide />
                                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                                <Area type="monotone" dataKey="drawdown" stroke="#ef4444" strokeWidth={2} fill="url(#drawdownGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Diversification Breaker */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 20 }}>Risk Concentration</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <AnimatedBar label="Sector Concentration" value={45} color={45 > 40 ? '#f59e0b' : '#10b981'} />
                        <AnimatedBar label="Top 5 Holdings" value={62} color={62 > 50 ? '#ef4444' : '#10b981'} />
                        <AnimatedBar label="Liquidity Risk" value={15} color="#10b981" />
                        <AnimatedBar label="Geo-Political Sensitivity" value={35} color="#3b82f6" />
                        <AnimatedBar label="Currency Exposure" value={10} color="#10b981" />
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 40 }}>
                <ComplianceBar />
            </div>
        </DashboardLayout>
    );
}
