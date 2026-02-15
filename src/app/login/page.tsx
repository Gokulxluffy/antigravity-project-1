"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Fingerprint, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate auth
        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-blue)] opacity-5 blur-[100px] rounded-full point-events-none"></div>

            <div className="glass-panel w-full max-w-md p-8 rounded-3xl relative z-10 border border-[var(--border-highlight)] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[var(--gradient-gold)] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl">
                        <Lock className="text-black" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Secure Terminal Access</h1>
                    <p className="text-[var(--text-secondary)] text-sm">Institutional Identity Verification</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Client ID / Email</label>
                        <input
                            type="email"
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
                            placeholder="institutional@client.com"
                            defaultValue="demo@antigravity.ai"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Access Key</label>
                        <input
                            type="password"
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)] transition-colors"
                            placeholder="••••••••••••"
                            defaultValue="password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 rounded-xl font-bold bg-[var(--gradient-blue)] text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Authenticate <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col items-center gap-4">
                    <button className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors text-sm">
                        <Fingerprint size={20} />
                        Use Biometric Passkey
                    </button>

                    <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs">
                        <ShieldCheck size={14} className="text-[var(--accent-emerald)]" />
                        256-bit End-to-End Encryption
                    </div>
                </div>
            </div>
        </div>
    );
}
