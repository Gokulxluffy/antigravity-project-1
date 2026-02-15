'use client';
// ============================================================
// Compliance Bar Component (Include 10)
// Persistent disclaimer banner for investment pages
// ============================================================
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Shield, Info } from 'lucide-react';
import { getMandatoryDisclaimers, getFooterDisclaimer, generateConsentText } from '../lib/compliance';

export function ComplianceBar() {
    const [expanded, setExpanded] = useState(false);
    const disclaimers = getMandatoryDisclaimers();

    return (
        <div style={{
            background: 'rgba(245,158,11,0.05)',
            borderTop: '1px solid rgba(245,158,11,0.2)',
            padding: '8px 24px',
        }}>
            <div
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', justifyContent: 'space-between' }}
                onClick={() => setExpanded(!expanded)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={14} color="#f59e0b" />
                    <span style={{ fontSize: 11, color: 'rgba(245,158,11,0.8)', fontWeight: 500 }}>
                        Investment Risk Disclaimer — AI-generated recommendations. Past performance ≠ future results.
                    </span>
                </div>
                {expanded ? <ChevronUp size={14} color="#f59e0b" /> : <ChevronDown size={14} color="#f59e0b" />}
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {disclaimers.map(d => (
                                <div key={d.id} style={{
                                    padding: '10px 14px', borderRadius: 8,
                                    background: d.severity === 'critical' ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${d.severity === 'critical' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)'}`,
                                    display: 'flex', gap: 8, alignItems: 'flex-start',
                                }}>
                                    {d.severity === 'critical'
                                        ? <Shield size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                                        : <Info size={14} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
                                    }
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>{d.title}</div>
                                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{d.content}</div>
                                        {d.regulatoryBody && (
                                            <div style={{ fontSize: 9, color: 'rgba(59,130,246,0.6)', marginTop: 4 }}>Regulatory: {d.regulatoryBody}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Risk Consent Modal Content ──
export function ConsentContent() {
    const text = generateConsentText();
    return (
        <div style={{ padding: 24, maxWidth: 500 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Shield size={20} color="#f59e0b" />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>Risk Acknowledgment</h3>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: 0 }}>{text}</p>
        </div>
    );
}

// ── Footer Disclaimer ──
export function FooterDisclaimer() {
    return (
        <div style={{
            padding: '12px 24px',
            background: 'rgba(0,0,0,0.2)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            fontSize: 9,
            color: 'rgba(255,255,255,0.3)',
            lineHeight: 1.6,
            textAlign: 'center',
        }}>
            {getFooterDisclaimer()}
        </div>
    );
}
