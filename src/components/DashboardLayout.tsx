'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, LayoutDashboard, Target, PieChart, ShieldAlert, BarChart3, MessageSquare, Settings, LogOut, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/invest', icon: Wallet, label: 'Invest' },
    { href: '/recommendations', icon: Target, label: 'Recommendations' },
    { href: '/portfolio', icon: PieChart, label: 'Portfolio' },
    { href: '/risk', icon: ShieldAlert, label: 'Risk Analysis' },
    { href: '/compare', icon: BarChart3, label: 'Compare' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);

    const sidebarWidth = collapsed ? 72 : 240;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            {/* Sidebar */}
            <aside style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                width: `${sidebarWidth}px`,
                zIndex: 40,
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(17,24,39,0.98)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid var(--border)',
                transition: 'width 0.3s ease',
                overflow: 'hidden',
            }}>
                {/* Logo */}
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg,#6366f1,#a78bfa)',
                        flexShrink: 0,
                    }}>
                        <TrendingUp size={20} color="white" />
                    </div>
                    {!collapsed && <span style={{ fontSize: 18, fontWeight: 700 }} className="gradient-text">InvestIQ</span>}
                </div>

                {/* Nav Links */}
                <nav style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                    {navItems.map(item => {
                        const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href}
                                className={`sidebar-link ${active ? 'active' : ''}`}
                                title={collapsed ? item.label : undefined}>
                                <item.icon size={20} style={{ flexShrink: 0 }} />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Links */}
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border)' }}>
                    <button onClick={() => setChatOpen(!chatOpen)} className="sidebar-link"
                        style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent' }}>
                        <MessageSquare size={20} style={{ flexShrink: 0 }} />
                        {!collapsed && <span>AI Advisor</span>}
                    </button>
                    <Link href="/settings" className="sidebar-link">
                        <Settings size={20} style={{ flexShrink: 0 }} />
                        {!collapsed && <span>Settings</span>}
                    </Link>
                    <Link href="/" className="sidebar-link">
                        <LogOut size={20} style={{ flexShrink: 0 }} />
                        {!collapsed && <span>Logout</span>}
                    </Link>
                    <button onClick={() => setCollapsed(!collapsed)}
                        style={{
                            marginTop: 8, width: '100%', textAlign: 'center',
                            padding: '8px', fontSize: 12, color: '#5a6585',
                            border: 'none', background: 'transparent', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                            borderRadius: 8, transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#5a6585')}>
                        {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> Collapse</>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main style={{
                flex: 1,
                marginLeft: `${sidebarWidth}px`,
                transition: 'margin-left 0.3s ease',
                minHeight: '100vh',
                width: `calc(100% - ${sidebarWidth}px)`,
            }}>
                <div style={{ padding: '32px', maxWidth: 1400, margin: '0 auto' }}>
                    {children}
                </div>
            </main>

            {/* AI Chatbot Panel */}
            <AnimatePresence>
                {chatOpen && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
                        style={{
                            position: 'fixed', right: 0, top: 0, height: '100vh', width: 380, zIndex: 50,
                            display: 'flex', flexDirection: 'column',
                            background: 'rgba(17,24,39,0.98)', backdropFilter: 'blur(20px)',
                            borderLeft: '1px solid var(--border)',
                        }}>
                        {/* Chat Header */}
                        <div style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'linear-gradient(135deg,#6366f1,#a78bfa)',
                                }}>
                                    <MessageSquare size={16} color="white" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14 }}>AI Investment Advisor</div>
                                    <div style={{ fontSize: 12, color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} /> Online
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setChatOpen(false)}
                                style={{ color: '#8b95b3', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18 }}>✕</button>
                        </div>
                        {/* Chat Body */}
                        <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div className="glass-card" style={{ padding: 12, maxWidth: '85%', alignSelf: 'flex-start' }}>
                                <p style={{ fontSize: 14, color: '#8b95b3', margin: 0 }}>👋 Hello! I&apos;m your AI investment advisor. I can help you with:</p>
                                <ul style={{ fontSize: 12, color: '#8b95b3', marginTop: 8, marginLeft: 16, listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <li>Stock analysis &amp; scoring</li>
                                    <li>Portfolio optimization</li>
                                    <li>Risk assessment</li>
                                    <li>Market insights</li>
                                </ul>
                            </div>
                            <div className="glass-card" style={{ padding: 12, maxWidth: '85%', alignSelf: 'flex-start' }}>
                                <p style={{ fontSize: 14, color: '#8b95b3', margin: 0 }}>Try asking: &quot;What are the best stocks for a conservative portfolio?&quot;</p>
                            </div>
                        </div>
                        {/* Chat Input */}
                        <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <input type="text" placeholder="Ask about investments..."
                                    style={{
                                        flex: 1, padding: '10px 16px', borderRadius: 12, fontSize: 14,
                                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                                        color: 'white', outline: 'none',
                                    }} />
                                <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: 12, fontSize: 14 }}>Send</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
