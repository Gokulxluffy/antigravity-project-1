'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, User, Mail, Lock } from 'lucide-react';

export default function RegisterPage() {
    return (
        <div className="grid-pattern" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '33%', right: '33%', width: 400, height: 400, borderRadius: '50%', opacity: 0.2, background: 'radial-gradient(circle,#a78bfa,transparent 70%)', filter: 'blur(100px)' }} />
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 24 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>
                            <TrendingUp size={22} color="white" />
                        </div>
                        <span className="gradient-text" style={{ fontSize: 24, fontWeight: 700 }}>InvestIQ</span>
                    </Link>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 16 }}>Create Account</h1>
                    <p style={{ color: '#8b95b3', fontSize: 14, marginTop: 4 }}>Start your intelligent investing journey</p>
                </div>
                <div className="glass-card" style={{ padding: 32 }}>
                    <form onSubmit={e => { e.preventDefault(); window.location.href = '/invest'; }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {[
                            { label: 'Full Name', icon: User, type: 'text', placeholder: 'Your name' },
                            { label: 'Email', icon: Mail, type: 'email', placeholder: 'you@example.com' },
                            { label: 'Password', icon: Lock, type: 'password', placeholder: 'Min. 8 characters' },
                        ].map(f => (
                            <div key={f.label}>
                                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#8b95b3', marginBottom: 8 }}>{f.label}</label>
                                <div style={{ position: 'relative' }}>
                                    <f.icon size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#5a6585' }} />
                                    <input type={f.type} placeholder={f.placeholder} style={{
                                        width: '100%', paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
                                        borderRadius: 12, fontSize: 14, background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                                        color: 'white', outline: 'none',
                                    }} />
                                </div>
                            </div>
                        ))}
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px 24px', fontSize: 14 }}>Create Account</button>
                    </form>
                    <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: '#8b95b3' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: '#a78bfa', fontWeight: 500, textDecoration: 'none' }}>Sign In</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
