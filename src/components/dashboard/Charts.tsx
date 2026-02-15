"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const MOCK_PRICE_DATA = Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1} Feb`,
    price: 2400 + Math.random() * 200 - 100,
}));

const ALLOCATION_DATA = [
    { name: 'Equity', value: 65, color: '#3b82f6' },
    { name: 'Debt', value: 20, color: '#14b8a6' },
    { name: 'Gold', value: 10, color: '#d4af37' },
    { name: 'Cash', value: 5, color: '#64748b' },
];

export function PriceHistoryChart() {
    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={MOCK_PRICE_DATA}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            borderColor: 'rgba(148, 163, 184, 0.2)',
                            borderRadius: '8px',
                            color: '#f8fafc'
                        }}
                        itemStyle={{ color: '#d4af37' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#d4af37"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export function PortfolioAllocationChart() {
    return (
        <div className="w-full h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={ALLOCATION_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {ALLOCATION_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            borderColor: 'rgba(148, 163, 184, 0.2)',
                            borderRadius: '8px',
                            color: '#f8fafc'
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
            {/* Center Stats */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-[var(--text-primary)]">₹10.5L</span>
                <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Total Assets</span>
            </div>
        </div>
    )
}
