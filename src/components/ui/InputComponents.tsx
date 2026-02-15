"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
}

export function PremiumSlider({ label, value, min, max, step = 1, unit = "", className, ...props }: SliderProps) {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className={cn("w-full space-y-4", className)}>
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">{label}</label>
                <span className="text-xl font-bold text-[var(--text-primary)] font-mono">
                    {unit}{value.toLocaleString()}
                </span>
            </div>
            <div className="relative w-full h-6 group">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    className="absolute w-full h-2 bg-[var(--bg-card-hover)] rounded-lg appearance-none cursor-pointer z-20 opacity-0"
                    {...props}
                />
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-[var(--bg-card-hover)] rounded-full overflow-hidden z-10">
                    <div
                        className="h-full bg-[var(--gradient-gold)] transition-all duration-100 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)] border-2 border-[var(--accent-gold)] z-10 pointer-events-none transition-all duration-100 ease-out"
                    style={{ left: `calc(${percentage}% - 12px)` }}
                />
            </div>
        </div>
    );
}

interface SelectionCardProps {
    title: string;
    description: string;
    selected: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
}

export function SelectionCard({ title, description, selected, onClick, icon }: SelectionCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative p-6 rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden group",
                selected
                    ? "bg-[rgba(212,175,55,0.1)] border-[var(--accent-gold)] shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                    : "bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--border-highlight)] hover:bg-[var(--bg-card-hover)]"
            )}
        >
            {selected && (
                <div className="absolute top-3 right-3 text-[var(--accent-gold)] animate-fade-in">
                    <Check size={20} strokeWidth={3} />
                </div>
            )}
            <div className="flex flex-col gap-3">
                {icon && <div className={cn("text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]", selected && "text-[var(--accent-gold)]")}>{icon}</div>}
                <h3 className={cn("text-lg font-bold transition-colors", selected ? "text-[var(--accent-gold)]" : "text-[var(--text-primary)]")}>{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
            </div>
        </div>
    );
}
