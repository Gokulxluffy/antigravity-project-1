'use client';
// ============================================================
// Visual Analytics Engine (Include 11)
// Interactive, real-time, data-linked charts
// ============================================================
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, CartesianGrid, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// ── Candlestick Chart ──
interface CandleData { date: string; open: number; high: number; low: number; close: number; volume: number }

export function CandlestickChart({ data, height = 300 }: { data: CandleData[]; height?: number }) {
    // Transform into OHLC bars
    const chartData = data.map(d => ({
        ...d,
        fill: d.close >= d.open ? '#10b981' : '#ef4444',
        bodyTop: Math.max(d.open, d.close),
        bodyBottom: Math.min(d.open, d.close),
        bodyHeight: Math.abs(d.close - d.open),
    }));

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div style={{ position: 'relative', height }}>
                <ResponsiveContainer width="100%" height="70%">
                    <BarChart data={chartData} barCategoryGap={2}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                        <YAxis domain={['auto', 'auto']} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#fff' }}
                            formatter={(value: number, name: string) => [`₹${value.toFixed(2)}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                        />
                        <Bar dataKey="bodyHeight" stackId="ohlc" radius={[2, 2, 0, 0]}>
                            {chartData.map((entry, i) => (
                                <Cell key={i} fill={entry.fill} fillOpacity={0.8} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                {/* Volume overlay */}
                <ResponsiveContainer width="100%" height="25%">
                    <BarChart data={chartData}>
                        <Bar dataKey="volume" fill="rgba(59,130,246,0.3)" radius={[2, 2, 0, 0]}>
                            {chartData.map((entry, i) => (
                                <Cell key={i} fill={entry.close >= entry.open ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

// ── Price History Chart ──
export function PriceHistoryChart({ prices, color = '#3b82f6', height = 200, showGrid = true }: {
    prices: number[]; color?: string; height?: number; showGrid?: boolean;
}) {
    const data = prices.map((p, i) => ({ month: `M${i + 1}`, price: p }));
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data}>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />}
                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                    <YAxis domain={['auto', 'auto']} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#fff' }} formatter={(v: number) => [`₹${v.toFixed(2)}`, 'Price']} />
                    <defs>
                        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2} fill={`url(#grad-${color.replace('#', '')})`} dot={false} />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
}

// ── Correlation Heatmap ──
export function CorrelationHeatmap({ pairs, symbols }: {
    pairs: Array<{ stockA: string; stockB: string; correlation: number }>;
    symbols: string[];
}) {
    const getColor = (corr: number) => {
        if (corr > 0.7) return 'rgba(239,68,68,0.7)';
        if (corr > 0.3) return 'rgba(245,158,11,0.5)';
        if (corr > -0.3) return 'rgba(107,114,128,0.3)';
        if (corr > -0.7) return 'rgba(59,130,246,0.5)';
        return 'rgba(16,185,129,0.7)';
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', fontSize: 11, width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.5)' }}></th>
                            {symbols.map(s => (
                                <th key={s} style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.6)', fontWeight: 500, writingMode: 'vertical-lr', textAlign: 'center' }}>{s}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {symbols.map(row => (
                            <tr key={row}>
                                <td style={{ padding: '6px 8px', color: 'rgba(255,255,255,0.6)', fontWeight: 500, whiteSpace: 'nowrap' }}>{row}</td>
                                {symbols.map(col => {
                                    if (row === col) {
                                        return <td key={col} style={{ padding: 4, textAlign: 'center' }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 4, background: 'rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#3b82f6', fontWeight: 600, margin: '0 auto' }}>1.00</div>
                                        </td>;
                                    }
                                    const pair = pairs.find(p => (p.stockA === row && p.stockB === col) || (p.stockA === col && p.stockB === row));
                                    const corr = pair?.correlation || 0;
                                    return (
                                        <td key={col} style={{ padding: 4, textAlign: 'center' }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 4, background: getColor(corr),
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 9, color: '#fff', fontWeight: 500, margin: '0 auto',
                                                cursor: 'pointer', transition: 'transform 0.2s',
                                            }} title={`${row} ↔ ${col}: ${corr.toFixed(2)}`}>
                                                {corr.toFixed(2)}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12, fontSize: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(16,185,129,0.7)' }} /> Strong Negative</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(107,114,128,0.3)' }} /> Neutral</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(239,68,68,0.7)' }} /> Strong Positive</span>
                </div>
            </div>
        </motion.div>
    );
}

// ── Risk-Return Scatter Plot ──
export function RiskReturnScatter({ data, height = 250 }: {
    data: Array<{ name: string; risk: number; return: number; score: number }>;
    height?: number;
}) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <ResponsiveContainer width="100%" height={height}>
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="risk" name="Risk Score" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} label={{ value: 'Risk →', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                    <YAxis dataKey="return" name="Expected Return" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} label={{ value: 'Return →', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#fff' }} />
                    <Scatter data={data} fill="#3b82f6">
                        {data.map((entry, i) => (
                            <Cell
                                key={i}
                                fill={entry.score >= 70 ? '#10b981' : entry.score >= 50 ? '#3b82f6' : entry.score >= 30 ? '#f59e0b' : '#ef4444'}
                                r={Math.max(4, entry.score / 10)}
                            />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </motion.div>
    );
}

// ── Sector Heatmap ──
export function SectorHeatmap({ sectors }: {
    sectors: Array<{ name: string; change: number; marketCap: number }>;
}) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 4 }}>
                {sectors.map((s, i) => {
                    const intensity = Math.min(1, Math.abs(s.change) / 3);
                    const bg = s.change >= 0
                        ? `rgba(16,185,129,${0.1 + intensity * 0.5})`
                        : `rgba(239,68,68,${0.1 + intensity * 0.5})`;
                    return (
                        <motion.div
                            key={s.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            style={{
                                padding: '12px 8px', borderRadius: 8, background: bg,
                                textAlign: 'center', cursor: 'pointer',
                                border: '1px solid rgba(255,255,255,0.05)',
                            }}
                        >
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500, marginBottom: 4 }}>{s.name}</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: s.change >= 0 ? '#10b981' : '#ef4444' }}>
                                {s.change >= 0 ? '+' : ''}{s.change.toFixed(1)}%
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

// ── Score Radar Chart ──
export function ScoreRadar({ scores, size = 250 }: {
    scores: Array<{ factor: string; score: number; fullMark?: number }>;
    size?: number;
}) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <ResponsiveContainer width="100%" height={size}>
                <RadarChart data={scores} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="factor" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}

// ── Growth Projection Chart ──
export function GrowthProjection({ data, height = 200 }: {
    data: Array<{ period: string; actual?: number; projected?: number }>;
    height?: number;
}) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <ResponsiveContainer width="100%" height={height}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="period" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#fff' }} />
                    {/* Actual line */}
                    <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} name="Actual" />
                    {/* Projected line */}
                    <Line type="monotone" dataKey="projected" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 3" dot={{ fill: '#3b82f6', r: 3 }} name="Projected" />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    );
}

// ── Mini Sparkline ──
export function Sparkline({ data, color = '#3b82f6', width = 80, height = 28 }: {
    data: number[]; color?: string; width?: number; height?: number;
}) {
    const chartData = data.map((v, i) => ({ i, v }));
    const trend = data[data.length - 1] > data[0] ? '#10b981' : '#ef4444';
    return (
        <ResponsiveContainer width={width} height={height}>
            <LineChart data={chartData}>
                <Line type="monotone" dataKey="v" stroke={trend} strokeWidth={1.5} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
}
