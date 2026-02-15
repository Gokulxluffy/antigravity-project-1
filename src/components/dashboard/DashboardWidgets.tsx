"use client";

import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
    label: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    icon?: React.ReactNode;
    chartData?: number[]; // Placeholder for sparkline
}

export function MetricCard({ label, value, change, isPositive, icon }: MetricCardProps) {
    return (
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {icon}
            </div>

            <p className="text-[var(--text-secondary)] text-sm font-medium mb-2">{label}</p>
            <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-4">{value}</h3>

            {change && (
                <div className={cn("flex items-center gap-1 text-sm font-semibold", isPositive ? "text-[var(--accent-emerald)]" : "text-[var(--accent-red)]")}>
                    {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {change} Today
                </div>
            )}
        </div>
    );
}

interface AIGaugeProps {
    score: number;
    label: string;
    size?: "sm" | "md" | "lg";
}

export function AIGauge({ score, label, size = "md" }: AIGaugeProps) {
    // Color logic
    let color = "var(--accent-red)";
    if (score > 40) color = "var(--accent-amber)";
    if (score > 60) color = "var(--accent-blue)";
    if (score > 80) color = "var(--accent-emerald)";

    const radius = size === "sm" ? 20 : size === "md" ? 36 : 50;
    const stroke = size === "sm" ? 3 : size === "md" ? 6 : 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const sizeClass = size === "sm" ? "w-12 h-12" : size === "md" ? "w-24 h-24" : "w-32 h-32";
    const textClass = size === "sm" ? "text-xs" : size === "md" ? "text-xl" : "text-2xl";

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`relative ${sizeClass} flex items-center justify-center`}>
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
                >
                    <circle
                        stroke="var(--bg-card-hover)"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        fill="transparent"
                    />
                    <circle
                        stroke={color}
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset, transition: "stroke-dashoffset 1s ease-out" }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        fill="transparent"
                    />
                </svg>
                <span className={`absolute ${textClass} font-bold text-[var(--text-primary)]`}>
                    {score}
                </span>
            </div>
            <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-medium">
                {label}
            </span>
        </div>
    );
}

export function AIConfidenceMeter({ confidence }: { confidence: number }) {
    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-[var(--text-secondary)]">AI Confidence</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">{confidence}%</span>
            </div>
            <div className="h-2 w-full bg-[var(--bg-card-hover)] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[var(--gradient-gold)] transition-all duration-1000 ease-out"
                    style={{ width: `${confidence}%` }}
                />
            </div>
        </div>
    )
}
