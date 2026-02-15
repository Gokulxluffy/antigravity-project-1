"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { MOCK_COMPANIES } from "@/lib/data/mockData";
import { BadgeCheck, AlertTriangle } from "lucide-react";

export default function MarketPage() {
    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)]">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-6 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-8">

                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Market Intelligence</h1>
                            <p className="text-[var(--text-secondary)]">AI-Driven Analysis of Capital Markets</p>
                        </div>
                    </div>

                    {/* Market Table */}
                    <div className="glass-panel rounded-2xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border)] bg-[var(--bg-card-hover)]">
                                    <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Company</th>
                                    <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Price</th>
                                    <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Change</th>
                                    <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">AI Score</th>
                                    <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Risk</th>
                                    <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Growth</th>
                                    <th className="p-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Health</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {MOCK_COMPANIES.map((company) => (
                                    <tr key={company.id} className="hover:bg-[var(--bg-card-hover)] transition-colors group cursor-pointer">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-[var(--bg-card)] flex items-center justify-center font-bold text-[var(--text-secondary)]">
                                                    {company.symbol[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[var(--text-primary)]">{company.symbol}</h4>
                                                    <p className="text-xs text-[var(--text-secondary)]">{company.sector}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-mono text-[var(--text-primary)]">₹{company.marketData.price.toLocaleString()}</td>
                                        <td className={`p-4 text-right font-mono font-bold ${company.marketData.changePercent >= 0 ? 'text-[var(--accent-emerald)]' : 'text-[var(--accent-red)]'}`}>
                                            {company.marketData.changePercent > 0 ? '+' : ''}{company.marketData.changePercent}%
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-card)] border border-[var(--border)]">
                                                <span className={`font-bold ${company.aiScore.total > 80 ? 'text-[var(--accent-gold)]' : 'text-[var(--text-primary)]'}`}>
                                                    {company.aiScore.total}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center">
                                                {company.aiScore.risk < 40 ? (
                                                    <BadgeCheck className="text-[var(--accent-emerald)]" size={20} />
                                                ) : (
                                                    <AlertTriangle className="text-[var(--accent-amber)]" size={20} />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="w-16 h-1 bg-[var(--bg-card)] rounded-full overflow-hidden mx-auto">
                                                <div className="h-full bg-[var(--accent-blue)]" style={{ width: `${company.aiScore.growthPotential}%` }} />
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="w-16 h-1 bg-[var(--bg-card)] rounded-full overflow-hidden mx-auto">
                                                <div className="h-full bg-[var(--accent-emerald)]" style={{ width: `${company.aiScore.financialHealth}%` }} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </div>
    );
}
