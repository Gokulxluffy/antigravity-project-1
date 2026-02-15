import Link from "next/link";
import { Search, Bell, User, Menu } from "lucide-react";

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[var(--border)] bg-[rgba(2,6,23,0.8)] backdrop-blur-md px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--gradient-gold)] flex items-center justify-center">
                        <span className="font-bold text-black text-lg">AI</span>
                    </div>
                    <span className="font-semibold text-xl tracking-tight text-[var(--text-primary)]">
                        ANTIGRAVITY
                    </span>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-6">
                <nav className="flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
                    <Link href="/markets" className="hover:text-[var(--text-primary)] transition-colors">Markets</Link>
                    <Link href="/analysis" className="hover:text-[var(--text-primary)] transition-colors">Analysis</Link>
                    <Link href="/portfolio" className="hover:text-[var(--text-primary)] transition-colors">Portfolio</Link>
                </nav>

                <div className="h-4 w-px bg-[var(--border)]" />

                <div className="flex items-center gap-4">
                    <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <Search size={20} />
                    </button>
                    <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--accent-red)] rounded-full border border-[var(--bg-primary)]"></span>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--accent-gold)] transition-colors">
                        <User size={16} />
                    </button>
                </div>
            </div>

            <button className="md:hidden text-[var(--text-primary)]">
                <Menu size={24} />
            </button>
        </header>
    );
}
