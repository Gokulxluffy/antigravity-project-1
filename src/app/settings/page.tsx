'use client';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Bell, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>Settings</h1>
                <p style={{ fontSize: 14, color: '#8b95b3', marginTop: 4 }}>Manage your profile and preferences</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640 }}>
                {/* Profile */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <User size={18} style={{ color: '#6366f1' }} /> Profile
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { label: 'Full Name', value: 'Investor', type: 'text' },
                            { label: 'Email', value: 'investor@example.com', type: 'email' },
                            { label: 'Phone', value: '+91 XXXXX XXXXX', type: 'tel' },
                        ].map(f => (
                            <div key={f.label}>
                                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#8b95b3', marginBottom: 6 }}>{f.label}</label>
                                <input type={f.type} defaultValue={f.value} style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
                                    background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'white', outline: 'none',
                                }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Preferences */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Shield size={18} style={{ color: '#fbbf24' }} /> Risk Preferences
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#8b95b3', marginBottom: 6 }}>Default Risk Level</label>
                            <select defaultValue="moderate" style={{
                                width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
                                background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'white', outline: 'none',
                            }}>
                                <option value="conservative">Conservative</option>
                                <option value="moderate">Moderate</option>
                                <option value="aggressive">Aggressive</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#8b95b3', marginBottom: 6 }}>Default Duration</label>
                            <select defaultValue="medium" style={{
                                width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
                                background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'white', outline: 'none',
                            }}>
                                <option value="short">Short (1 Year)</option>
                                <option value="medium">Medium (3 Years)</option>
                                <option value="long">Long (5+ Years)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Bell size={18} style={{ color: '#38bdf8' }} /> Notifications
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { label: 'Email alerts for portfolio changes', defaultChecked: true },
                            { label: 'Weekly market summary', defaultChecked: true },
                            { label: 'AI recommendation alerts', defaultChecked: false },
                            { label: 'Risk threshold warnings', defaultChecked: true },
                        ].map(n => (
                            <label key={n.label} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontSize: 14, color: '#8b95b3' }}>
                                <input type="checkbox" defaultChecked={n.defaultChecked} style={{ width: 18, height: 18, accentColor: '#6366f1' }} />
                                {n.label}
                            </label>
                        ))}
                    </div>
                </div>

                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 24px', fontSize: 14, width: 'fit-content' }}>
                    <Save size={16} /> Save Changes
                </button>
            </div>
        </DashboardLayout>
    );
}
