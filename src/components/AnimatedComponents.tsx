'use client';
// ============================================================
// Animated Components Library (Include 3)
// Premium fintech UI building blocks
// ============================================================
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { cardHover, livePulse, scaleIn, staggerContainer, staggerItem, scrollReveal, glowCardHover } from '../lib/animations';

// ── Animated Counter ──
export function AnimatedCounter({ value, duration = 1.5, prefix = '', suffix = '', decimals = 0, style }: {
    value: number; duration?: number; prefix?: string; suffix?: string; decimals?: number; style?: React.CSSProperties;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const rounded = useTransform(motionValue, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const controls = animate(motionValue, value, { duration, ease: 'easeOut' });
            return () => controls.stop();
        }
    }, [isInView, value, duration, motionValue]);

    return <motion.span ref={ref} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{rounded}</motion.span>;
}

// ── Animated Progress Ring ──
export function AnimatedProgressRing({ score, size = 80, strokeWidth = 6, color, label }: {
    score: number; size?: number; strokeWidth?: number; color?: string; label?: string;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const fillColor = color || (score >= 70 ? '#10b981' : score >= 50 ? '#3b82f6' : score >= 30 ? '#f59e0b' : '#ef4444');

    return (
        <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
                <motion.circle
                    cx={size / 2} cy={size / 2} r={radius} fill="none"
                    stroke={fillColor} strokeWidth={strokeWidth} strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (circumference * score) / 100 }}
                    transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                    style={{ filter: `drop-shadow(0 0 6px ${fillColor})` }}
                />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: size * 0.25, fontWeight: 700, color: fillColor }}>
                    <AnimatedCounter value={score} decimals={0} />
                </div>
                {label && <div style={{ fontSize: size * 0.12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{label}</div>}
            </div>
        </div>
    );
}

// ── Glow Card ──
export function GlowCard({ children, style, glowColor = 'rgba(59,130,246,0.15)' }: {
    children: ReactNode; style?: React.CSSProperties; glowColor?: string;
}) {
    return (
        <motion.div
            {...cardHover}
            style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: 24,
                backdropFilter: 'blur(20px)',
                transition: 'box-shadow 0.3s ease',
                ...style,
            }}
            whileHover={{
                ...cardHover.whileHover,
                boxShadow: `0 0 30px ${glowColor}, 0 8px 32px rgba(0,0,0,0.3)`,
            }}
        >
            {children}
        </motion.div>
    );
}

// ── Pulse Indicator (Live Data) ──
export function PulseIndicator({ active = true, color = '#10b981', size = 10 }: {
    active?: boolean; color?: string; size?: number;
}) {
    return (
        <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <motion.span
                animate={active ? { scale: [1, 1.5, 1], opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    width: size, height: size, borderRadius: '50%', background: color,
                    boxShadow: `0 0 8px ${color}`, display: 'inline-block',
                }}
            />
        </span>
    );
}

// ── Animated Bar ──
export function AnimatedBar({ value, maxValue = 100, color, height = 8, label, showValue = true }: {
    value: number; maxValue?: number; color?: string; height?: number; label?: string; showValue?: boolean;
}) {
    const pct = Math.min(100, (value / maxValue) * 100);
    const barColor = color || (pct >= 70 ? '#10b981' : pct >= 50 ? '#3b82f6' : pct >= 30 ? '#f59e0b' : '#ef4444');
    return (
        <div>
            {(label || showValue) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                    {label && <span style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</span>}
                    {showValue && <span style={{ color: barColor, fontWeight: 600 }}>{value.toFixed(1)}</span>}
                </div>
            )}
            <div style={{ width: '100%', height, borderRadius: height, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    style={{ height: '100%', borderRadius: height, background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`, boxShadow: `0 0 8px ${barColor}44` }}
                />
            </div>
        </div>
    );
}

// ── Verdict Badge ──
export function VerdictBadge({ verdict, grade, confidence }: {
    verdict: 'INVEST' | 'DO NOT INVEST'; grade: string; confidence: number;
}) {
    const isInvest = verdict === 'INVEST';
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
                display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                padding: '24px 40px', borderRadius: 20,
                background: isInvest
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))'
                    : 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
                border: `2px solid ${isInvest ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
                boxShadow: `0 0 40px ${isInvest ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}
        >
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 2, color: isInvest ? '#10b981' : '#ef4444' }}>
                {verdict}
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Grade</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: isInvest ? '#10b981' : '#f59e0b' }}>{grade}</span>
                <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Confidence</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#3b82f6' }}>{confidence}%</span>
            </div>
        </motion.div>
    );
}

// ── Stagger List ──
export function StaggerList({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
    return (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" style={style}>
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
    return (
        <motion.div variants={staggerItem} style={style}>
            {children}
        </motion.div>
    );
}

// ── Scroll Reveal ──
export function ScrollReveal({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
    return (
        <motion.div {...scrollReveal} style={style}>
            {children}
        </motion.div>
    );
}

// ── HUD Metric Card ──
export function HUDMetricCard({ label, value, unit, trend, icon }: {
    label: string; value: number | string; unit?: string; trend?: number; icon?: ReactNode;
}) {
    return (
        <motion.div
            {...scaleIn}
            style={{
                padding: '16px 20px', borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                position: 'relative', overflow: 'hidden',
            }}
        >
            {/* HUD corner brackets */}
            <div style={{ position: 'absolute', top: 4, left: 4, width: 12, height: 12, borderTop: '2px solid rgba(59,130,246,0.4)', borderLeft: '2px solid rgba(59,130,246,0.4)' }} />
            <div style={{ position: 'absolute', top: 4, right: 4, width: 12, height: 12, borderTop: '2px solid rgba(59,130,246,0.4)', borderRight: '2px solid rgba(59,130,246,0.4)' }} />
            <div style={{ position: 'absolute', bottom: 4, left: 4, width: 12, height: 12, borderBottom: '2px solid rgba(59,130,246,0.4)', borderLeft: '2px solid rgba(59,130,246,0.4)' }} />
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: 12, height: 12, borderBottom: '2px solid rgba(59,130,246,0.4)', borderRight: '2px solid rgba(59,130,246,0.4)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {icon}
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>
                    {typeof value === 'number' ? <AnimatedCounter value={value} decimals={1} /> : value}
                </span>
                {unit && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{unit}</span>}
                {trend !== undefined && (
                    <span style={{ fontSize: 12, marginLeft: 8, color: trend >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
                    </span>
                )}
            </div>
        </motion.div>
    );
}

// ── Live Market Ticker Bar ──
export function LiveTickerBar({ ticks }: {
    ticks: Array<{ symbol: string; price: number; change: number; changePercent: number }>;
}) {
    return (
        <div style={{
            overflow: 'hidden', width: '100%', height: 36,
            background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center',
        }}>
            <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'flex', gap: 32, whiteSpace: 'nowrap', paddingLeft: 16 }}
            >
                {[...ticks, ...ticks].map((t, i) => (
                    <span key={i} style={{ display: 'inline-flex', gap: 8, fontSize: 12, alignItems: 'center' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{t.symbol}</span>
                        <span style={{ color: '#fff' }}>₹{t.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        <span style={{ color: t.change >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                            {t.change >= 0 ? '+' : ''}{t.changePercent.toFixed(2)}%
                        </span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
