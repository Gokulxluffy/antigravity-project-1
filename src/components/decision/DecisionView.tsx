"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CheckCircle, XCircle, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import { generatePortfolio, InvestmentDecision } from "@/lib/ai/portfolioEngine";
import { runMonteCarloSimulation } from "@/lib/ai/simulation";

// Mock User Profile (In real app, comes from Context/URL params)
const MOCK_PROFILE = {
    capital: 1000000,
    durationYears: 10,
    riskTolerance: "Growth" as const, // Type assertion
    goals: ["Wealth Creation"]
};

export function DecisionView() {
    const [decision, setDecision] = useState<InvestmentDecision | null>(null);
    const [simulationData, setSimulationData] = useState<any[]>([]);

    useEffect(() => {
        // 1. Run AI Engine
        const result = generatePortfolio(MOCK_PROFILE);
        setDecision(result);

        // 2. Run Simulation
        const sim = runMonteCarloSimulation(MOCK_PROFILE.capital, MOCK_PROFILE.durationYears);
        setSimulationData(sim);
    }, []);

    if (!decision) return <div className="p-20 text-center animate-pulse">Running Neural Architecture...</div>;

    return (
        <div className="space-y-12">

            {/* 1. HERO DECISION STAMP */}
            <div className="flex flex-col items-center justify-center py-12 text-center relative overflow-hidden">
                <div className={`absolute inset-0 opacity-10 blur-3xl ${decision.shouldInvest ? "bg-[var(--accent-emerald)]" : "bg-[var(--accent-red)]"}`} />

                <div className="relative z-10 glass-panel p-12 rounded-3xl border-2 border-[var(--border-highlight)] shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                    <span className="text-sm font-bold tracking-[0.3em] uppercase text-[var(--text-secondary)] mb-4 block">
                        FINAL AI VERDICT
                    </span>

                    <div className="flex items-center gap-6 mb-6">
                        {decision.shouldInvest ? (
                            <CheckCircle size={64} className="text-[var(--accent-emerald)]" />
                        ) : (
                            <XCircle size={64} className="text-[var(--accent-red)]" />
                        )}
                        <h1 className="text-7xl font-extrabold tracking-tighter">
                            {decision.shouldInvest ? "ACCUMULATE" : "WAIT"}
                        </h1>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <div className="px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-sm font-medium flex items-center gap-2">
                            <ShieldCheck size={16} className="text-[var(--accent-gold)]" />
                            Confidence: <span className="text-[var(--text-primary)] font-bold">{decision.confidenceScore}%</span>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-sm font-medium flex items-center gap-2">
                            <AlertTriangle size={16} className="text-[var(--accent-blue)]" />
                            Risk Model: <span className="text-[var(--text-primary)] font-bold">{MOCK_PROFILE.riskTolerance}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. REASONING & ALLOCATION GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Reasoning */}
                <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="text-[var(--accent-gold)]" />
                        Intelligence Report
                    </h3>
                    <ul className="space-y-4">
                        {decision.reasoning.map((reason, i) => (
                            <li key={i} className="flex gap-3 text-[var(--text-primary)]">
                                <span className="text-[var(--accent-gold)] font-bold">0{i + 1}.</span>
                                <span className="leading-relaxed">{reason}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Allocation Breakdown */}
                <div className="glass-panel p-8 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6">Optimal Allocation</h3>
                    <div className="space-y-4">
                        {decision.allocations.map(alloc => (
                            <div key={alloc.assetClass}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>{alloc.assetClass}</span>
                                    <span className="font-bold">{alloc.percentage}%</span>
                                </div>
                                <div className="h-2 bg-[var(--bg-card-hover)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--accent-blue)]"
                                        style={{ width: `${alloc.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. WEALTH PROJECTION */}
            <div className="glass-panel p-8 rounded-2xl">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Projected Wealth Curve</h3>
                        <p className="text-[var(--text-secondary)] text-sm">Monte Carlo Simulation (1,000 Iterations)</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-[var(--text-secondary)]">Expected Value (10Y)</p>
                        <p className="text-2xl font-bold text-[var(--accent-emerald)]">
                            ₹{(simulationData[simulationData.length - 1]?.balanced)?.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={simulationData}>
                            <defs>
                                <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="year" stroke="#64748b" tickLine={false} axisLine={false} />
                            <YAxis
                                stroke="#64748b"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `₹${val / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                                formatter={(val: number) => `₹${val.toLocaleString()}`}
                            />
                            <Area
                                type="monotone"
                                dataKey="balanced"
                                stroke="#14b8a6"
                                fillOpacity={1}
                                fill="url(#colorGrowth)"
                                strokeWidth={3}
                            />
                            <Area
                                type="monotone"
                                dataKey="conservative"
                                stroke="#64748b"
                                fill="transparent"
                                strokeDasharray="5 5"
                            />
                            <Area
                                type="monotone"
                                dataKey="aggressive"
                                stroke="#3b82f6"
                                fill="transparent"
                                strokeDasharray="5 5"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 4. SELECTED ASSETS */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold">Selected Instruments</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {decision.selectedStocks.map(stock => (
                        <div key={stock.id} className="glass-panel p-6 rounded-xl border-l-4 border-[var(--accent-gold)]">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-lg">{stock.symbol}</h4>
                                    <p className="text-xs text-[var(--text-secondary)]">{stock.sector}</p>
                                </div>
                                <div className="w-8 h-8 rounded bg-[var(--bg-card)] flex items-center justify-center font-bold text-[var(--text-primary)]">
                                    {stock.aiScore.total}
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Price</span>
                                    <span className="font-mono">₹{stock.marketData.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Growth Score</span>
                                    <span className="font-bold text-[var(--accent-blue)]">{stock.aiScore.growthPotential}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
