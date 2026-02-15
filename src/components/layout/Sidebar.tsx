import Link from "next/link";
import {
    LayoutDashboard,
    BarChart3,
    PieChart,
    TrendingUp,
    BrainCircuit,
    Settings,
    HelpCircle
} from "lucide-react";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: TrendingUp, label: "Market Intelligence", href: "/market" },
    { icon: BrainCircuit, label: "AI Forecasts", href: "/ai-forecasts" },
    { icon: PieChart, label: "Portfolio", href: "/portfolio" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
];

export function Sidebar() {
    return (
        <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-[var(--border)] bg-[rgba(2,6,23,0.95)] backdrop-blur-sm hidden lg:flex flex-col z-40">
            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] transition-all group"
                    >
                        <item.icon size={20} className="group-hover:text-[var(--accent-gold)] transition-colors" />
                        {item.label}
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-[var(--border)] space-y-2">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] transition-all"
                >
                    <Settings size={20} />
                    Settings
                </Link>
                <Link
                    href="/help"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] transition-all"
                >
                    <HelpCircle size={20} />
                    Support
                </Link>
            </div>
        </aside>
    );
}
