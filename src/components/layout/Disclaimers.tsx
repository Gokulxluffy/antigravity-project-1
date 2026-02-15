"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function RegulatoryDisclaimer() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[rgba(2,6,23,0.95)] border-t border-[var(--accent-red)] p-4 z-50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
                <p className="flex-1 text-center md:text-left">
                    <strong className="text-[var(--text-primary)] uppercase tracking-wider">Regulatory Warning:</strong> Investment in securities market are subject to market risks. Read all the related documents carefully before investing.
                    This platform uses AI Models for educational and informational purposes only and does not constitute financial advice.
                    Past performance is not indicative of future returns. The AI Score is a probabilistic metric, not a guarantee.
                </p>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-2 hover:bg-[var(--bg-card-hover)] rounded-full transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
