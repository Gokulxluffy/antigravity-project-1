'use client';
import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { allStocks } from '@/lib/stockData';
import { scoreStock } from '@/lib/scoringEngine';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { Search, Plus, X, BarChart3, TrendingUp, CheckCircle2, Trophy } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts';
import { GlowCard, AnimatedBar } from '@/components/AnimatedComponents';
import { ComplianceBar } from '@/components/ComplianceBar';

const COLORS = ['#6366f1', '#34d399', '#f59e0b', '#ef4444'];

const metrics = [
    { key: 'composite', label: 'AI Score', format: (v: number) => v.toFixed(0), higherBetter: true },
    { key: 'pe', label: 'P/E Ratio', format: (v: number) => v.toFixed(1), higherBetter: false },
    { key: 'pb', label: 'P/B Ratio', format: (v: number) => v.toFixed(1), higherBetter: false },
    { key: 'roe', label: 'ROE', format: (v: number) => `${v}%`, higherBetter: true },
    { key: 'roce', label: 'ROCE', format: (v: number) => `${v}%`, higherBetter: true },
    { key: 'debt', label: 'Debt/Equity', format: (v: number) => v.toFixed(2), higherBetter: false },
    { key: 'rev', label: 'Rev Growth', format: (v: number) => `${v}%`, higherBetter: true },
    { key: 'pat', label: 'Profit Growth', format: (v: number) => `${v}%`, higherBetter: true },
    { key: 'prom', label: 'Promoter Hold', format: (v: number) => `${v}%`, higherBetter: true },
];

export default function ComparePage() {
    const [selected, setSelected] = useState<string[]>([]);
    const [search, setSearch] = useState('');

    const filtered = search.length > 0 ? allStocks.filter(s =>
        s.company.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.company.name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 8) : [];

    const selectedStocks = useMemo(() => {
        return selected.map(sym => {
            const stock = allStocks.find(s => s.company.symbol === sym)!;
            const score = scoreStock(stock);
            return { stock, score };
        });
    }, [selected]);

    // Comparison Data Preparation
    const comparisonData = metrics.map(m => {
        const row = { metric: m.label, key: m.key };
        selectedStocks.forEach((s, i) => {
            let val = 0;
            if (m.key === 'composite') val = s.score.compositeScore;
            else if (m.key === 'pe') val = s.stock.price.pe;
            else if (m.key === 'pb') val = s.stock.price.pb;
            else if (m.key === 'roe') val = s.stock.financials.roe;
            else if (m.key === 'roce') val = s.stock.financials.roce;
            else if (m.key === 'debt') val = s.stock.financials.debtToEquity;
            else if (m.key === 'rev') val = s.stock.financials.revenueGrowth;
            else if (m.key === 'pat') val = s.stock.financials.profitCAGR3Y;
            else if (m.key === 'prom') val = s.stock.holdings.promoterHolding;

            // @ts-ignore
            row[s.stock.company.symbol] = val;
        });

        // Find winner
        const values = selectedStocks.map(s => {
            // @ts-ignore
            return row[s.stock.company.symbol];
        });

        let winnerIdx = -1;
        if (values.length > 1) {
            const best = m.higherBetter ? Math.max(...values) : Math.min(...values);
            winnerIdx = values.indexOf(best);
        }

        return { ...row, winnerIdx, m };
    });

    // Chart Data (Normalized Price)
    const chartData = useMemo(() => {
        if (selectedStocks.length === 0) return [];
        const length = selectedStocks[0].stock.historicalPrices.length;
        return Array.from({ length }, (_, i) => {
            const point: any = { month: `M${i + 1}` };
            selectedStocks.forEach(s => {
                const base = s.stock.historicalPrices[0];
                point[s.stock.company.symbol] = ((s.stock.historicalPrices[i] - base) / base) * 100;
            });
            return point;
        });
    }, [selectedStocks]);

    return (
        <DashboardLayout>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>Compare Stocks</h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                    Side-by-side analysis of key metrics and AI scores
                </p>
            </div>

            {/* Search & Chips */}
            <div className="glass-card" style={{ padding: 24, marginBottom: 24, position: 'relative', zIndex: 20 }}>
                <div style={{ position: 'relative', maxWidth: 400, marginBottom: 16 }}>
                    <Search size={16} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', left: 12, top: 12 }} />
                    <input
                        type="text"
                        placeholder="Search stock to add (e.g., RELIANCE)"
                        value={search} onChange={e => setSearch(e.target.value)}
                        style={{
                            width: '100%', padding: '10px 12px 10px 40px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff', fontSize: 14, outline: 'none'
                        }}
                    />

                    {/* Dropdown */}
                    <AnimatePresence>
                        {filtered.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                style={{
                                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8,
                                    background: '#1a1f36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 50
                                }}
                            >
                                {filtered.map(s => {
                                    const disabled = selected.includes(s.company.symbol) || selected.length >= 4;
                                    return (
                                        <button key={s.company.symbol}
                                            disabled={disabled}
                                            onClick={() => { setSelected([...selected, s.company.symbol]); setSearch(''); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                width: '100%', padding: '12px 16px', border: 'none', background: 'transparent',
                                                textAlign: 'left', color: '#fff', cursor: disabled ? 'default' : 'pointer',
                                                opacity: disabled ? 0.5 : 1
                                            }}
                                            onMouseEnter={e => !disabled && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                                            onMouseLeave={e => !disabled && (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.company.symbol}</div>
                                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.company.name}</div>
                                            </div>
                                            {!disabled && <Plus size={16} color="#6366f1" />}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Selected Chips */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {selected.map((sym, i) => (
                        <div key={sym} style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 999,
                            background: `rgba(${parseInt(COLORS[i].slice(1, 3), 16)}, ${parseInt(COLORS[i].slice(3, 5), 16)}, ${parseInt(COLORS[i].slice(5, 7), 16)}, 0.15)`,
                            border: `1px solid ${COLORS[i]}`, color: '#fff', fontSize: 13, fontWeight: 600
                        }}>
                            <div style={{ width: 8, height: 8, borderRadius: 4, background: COLORS[i] }} />
                            {sym}
                            <button onClick={() => setSelected(selected.filter(s => s !== sym))} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                                <X size={14} color="rgba(255,255,255,0.5)" />
                            </button>
                        </div>
                    ))}
                    {selected.length === 0 && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', padding: '8px 0' }}>No stocks selected. Search to add.</div>}
                </div>
            </div>

            {/* Comparison Content */}
            {selectedStocks.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Performance Chart */}
                    <div className="glass-card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <TrendingUp size={18} color="#34d399" /> Relative Price Performance (12M)
                        </h3>
                        <div style={{ height: 300, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} itemSorter={(item) => (item.value as number) * -1} />
                                    <Legend />
                                    {selectedStocks.map((s, i) => (
                                        <Area
                                            key={s.stock.company.symbol}
                                            type="monotone"
                                            dataKey={s.stock.company.symbol}
                                            stroke={COLORS[i]}
                                            strokeWidth={2}
                                            fill={`url(#grad${i})`}
                                            fillOpacity={0.1}
                                        />
                                    ))}
                                    <defs>
                                        {selectedStocks.map((s, i) => (
                                            <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={COLORS[i]} stopOpacity={0.2} />
                                                <stop offset="100%" stopColor={COLORS[i]} stopOpacity={0} />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Metric Table */}
                    <div className="glass-card" style={{ padding: 24, overflowX: 'auto' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Trophy size={18} color="#fbbf24" /> Head-to-Head Comparison
                        </h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '16px', color: 'rgba(255,255,255,0.4)', fontSize: 12, textTransform: 'uppercase', minWidth: 150 }}>Metric</th>
                                    {selectedStocks.map((s, i) => (
                                        <th key={s.stock.company.symbol} style={{ padding: '16px', textAlign: 'center', minWidth: 140 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                                <div style={{ color: COLORS[i], fontWeight: 700, fontSize: 16 }}>{s.stock.company.symbol}</div>
                                                <div style={{ fontSize: 13, color: '#fff' }}>₹{formatNumber(s.stock.price.currentPrice)}</div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonData.map((row, rowIdx) => (
                                    <tr key={row.key} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: rowIdx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                                        <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500 }}>
                                            {row.metric}
                                        </td>
                                        {selectedStocks.map((s, i) => {
                                            const isWinner = row.winnerIdx === i;
                                            // @ts-ignore
                                            const val = row[s.stock.company.symbol];
                                            return (
                                                <td key={s.stock.company.symbol} style={{ padding: '16px', textAlign: 'center' }}>
                                                    <div style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                                        color: isWinner ? COLORS[i] : 'rgba(255,255,255,0.8)',
                                                        fontWeight: isWinner ? 700 : 400,
                                                        fontSize: isWinner ? 15 : 14,
                                                        padding: '4px 10px',
                                                        borderRadius: 8,
                                                        background: isWinner ? `rgba(${parseInt(COLORS[i].slice(1, 3), 16)}, ${parseInt(COLORS[i].slice(3, 5), 16)}, ${parseInt(COLORS[i].slice(5, 7), 16)}, 0.1)` : 'transparent'
                                                    }}>
                                                        {row.m.format(val)}
                                                        {isWinner && selectedStocks.length > 1 && <Trophy size={12} />}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div style={{ marginTop: 40 }}>
                <ComplianceBar />
            </div>
        </DashboardLayout>
    );
}
