"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { PortfolioAllocationChart } from "@/components/dashboard/Charts";
import { SelectionCard } from "@/components/ui/InputComponents";
import { MOCK_COMPANIES } from "@/lib/data/mockData";

export default function PortfolioPage() {
    const holdings = MOCK_COMPANIES.slice(0, 3); // Simulate holding top 3 stocks

    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)]">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-6 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Portfolio</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Allocation Chart */}
                        <div className="glass-panel p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-4">Current Allocation</h3>
                            <PortfolioAllocationChart />
                        </div>

                        {/* Holdings List */}
                        <div className="glass-panel p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-4">Active Holdings</h3>
                            <div className="space-y-4">
                                {holdings.map(stock => (
                                    <div key={stock.id} className="flex justify-between items-center p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[var(--bg-card-hover)] flex items-center justify-center font-bold text-[var(--accent-gold)]">
                                                {stock.symbol[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold">{stock.symbol}</h4>
                                                <p className="text-xs text-[var(--text-secondary)]">{stock.sector}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-bold">₹{stock.marketData.price.toLocaleString()}</p>
                                            <p className="text-xs text-[var(--accent-emerald)]">+12.5% Gain</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
