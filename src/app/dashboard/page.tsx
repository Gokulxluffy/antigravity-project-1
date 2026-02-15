"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { MetricCard, AIGauge, AIConfidenceMeter } from "@/components/dashboard/DashboardWidgets";
import { PriceHistoryChart, PortfolioAllocationChart } from "@/components/dashboard/Charts";
import { TrendingUp, Activity, ShieldCheck, Zap } from "lucide-react";
import { MOCK_COMPANIES } from "@/lib/data/mockData";

export default function DashboardPage() {
    const topPick = MOCK_COMPANIES[0]; // Reliance as example top pick

    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)]">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-6 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header / Greeting */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Command Center</h1>
                            <p className="text-[var(--text-secondary)]">AI Market Intelligence v1.0 • System Online</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-mono font-bold border border-green-500/20 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                MARKET LIVE
                            </span>
                        </div>
                    </div>

                    {/* Top Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard
                            label="Portfolio Value"
                            value="₹10,42,500"
                            change="+2.4%"
                            isPositive={true}
                            icon={<Activity className="text-[var(--accent-blue)]" />}
                        />
                        <MetricCard
                            label="Day Return"
                            value="₹24,200"
                            change="+1.8%"
                            isPositive={true}
                            icon={<TrendingUp className="text-[var(--accent-emerald)]" />}
                        />
                        <MetricCard
                            label="Risk Exposure"
                            value="Low"
                            change="-5% (Improving)"
                            isPositive={true}
                            icon={<ShieldCheck className="text-[var(--accent-gold)]" />}
                        />
                        <MetricCard
                            label="AI Confidence"
                            value="88/100"
                            change="High"
                            isPositive={true}
                            icon={<Zap className="text-[var(--accent-violet)]" />}
                        />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Visualizer Column (Left - 2cols) */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Main Chart */}
                            <div className="glass-panel p-6 rounded-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Performance Forecast</h3>
                                    <div className="flex items-center gap-2">
                                        <button className="px-3 py-1 text-xs font-medium rounded bg-[var(--bg-card-hover)] text-[var(--text-primary)]">1D</button>
                                        <button className="px-3 py-1 text-xs font-medium rounded hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)]">1W</button>
                                        <button className="px-3 py-1 text-xs font-medium rounded hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)]">1M</button>
                                    </div>
                                </div>
                                <PriceHistoryChart />
                            </div>

                            {/* AI Insights Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-panel p-6 rounded-2xl">
                                    <h3 className="text-lg font-bold mb-4">Top AI Pick</h3>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--bg-card-hover)] text-[var(--text-primary)] font-bold">
                                            {topPick.symbol.slice(0, 1)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[var(--text-primary)]">{topPick.symbol}</h4>
                                            <p className="text-xs text-[var(--text-secondary)]">{topPick.name}</p>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <p className="text-lg font-bold text-[var(--text-primary)]">₹{topPick.marketData.price}</p>
                                            <p className="text-xs text-[var(--accent-emerald)]">+{topPick.marketData.changePercent}%</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-[var(--text-secondary)]">AI Score</span>
                                                <span className="text-[var(--accent-gold)] font-bold">{topPick.aiScore.total}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[var(--bg-card-hover)] rounded-full overflow-hidden">
                                                <div className="h-full bg-[var(--accent-gold)]" style={{ width: `${topPick.aiScore.total}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-[var(--text-secondary)]">Risk Level</span>
                                                <span className="text-[var(--accent-blue)] font-bold">{topPick.aiScore.risk} (Safe)</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-[var(--bg-card-hover)] rounded-full overflow-hidden">
                                                <div className="h-full bg-[var(--accent-blue)]" style={{ width: `${80}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <h3 className="text-lg font-bold mb-6 w-full text-left">Market Sentiment</h3>
                                    <AIGauge score={92} label="Bullish" size="lg" />
                                    <p className="mt-4 text-sm text-[var(--text-secondary)] px-4">
                                        Institutional analysis indicates strong momentum in Tech and Energy sectors.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column (1col) */}
                        <div className="space-y-8">
                            <div className="glass-panel p-6 rounded-2xl">
                                <h3 className="text-lg font-bold mb-6">Asset Allocation</h3>
                                <PortfolioAllocationChart />
                            </div>

                            <div className="glass-panel p-6 rounded-2xl">
                                <h3 className="text-lg font-bold mb-4">AI Watchlist</h3>
                                <div className="space-y-4">
                                    {MOCK_COMPANIES.slice(1, 4).map((company) => (
                                        <div key={company.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer group">
                                            <div>
                                                <h5 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors">{company.symbol}</h5>
                                                <p className="text-xs text-[var(--text-secondary)]">AI Score: {company.aiScore.total}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-mono text-[var(--text-primary)]">₹{company.marketData.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
