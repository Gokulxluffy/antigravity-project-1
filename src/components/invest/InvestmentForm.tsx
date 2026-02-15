"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumSlider, SelectionCard } from "@/components/ui/InputComponents";
import { ArrowRight, Wallet, Clock, TrendingUp, Target, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const STEPS = [
    { id: 1, title: "Capital Allocation", icon: Wallet },
    { id: 2, title: "Time Horizon", icon: Clock },
    { id: 3, title: "Risk Profile", icon: TrendingUp },
    { id: 4, title: "Objectives", icon: Target },
];

export function InvestmentForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // Form State
    const [capital, setCapital] = useState(100000);
    const [duration, setDuration] = useState(5);
    const [risk, setRisk] = useState<string>("");
    const [goals, setGoals] = useState<string[]>([]);

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(curr => curr + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(curr => curr - 1);
        }
    };

    const handleSubmit = async () => {
        setIsProcessing(true);
        // Simulate API processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        router.push("/dashboard"); // Redirect to dashboard after "processing"
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="flex justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--border)] -z-10" />
                <div
                    className="absolute top-1/2 left-0 h-0.5 bg-[var(--gradient-gold)] -z-10 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />

                {STEPS.map((step) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-3 bg-[var(--bg-primary)] px-2">
                            <div
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                    isActive ? "border-[var(--accent-gold)] bg-[rgba(212,175,55,0.1)] text-[var(--accent-gold)] shadow-[0_0_15px_rgba(212,175,55,0.3)]" :
                                        isCompleted ? "border-[var(--accent-gold)] bg-[var(--accent-gold)] text-[var(--bg-primary)]" :
                                            "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-muted)]"
                                )}
                            >
                                <step.icon size={20} />
                            </div>
                            <span className={cn(
                                "text-xs font-bold tracking-wider uppercase transition-colors",
                                isActive || isCompleted ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                            )}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Form Content */}
            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-3">Define Your Capital</h2>
                                <p className="text-[var(--text-secondary)]">How much capital would you like the AI to deploy for optimization?</p>
                            </div>

                            <div className="glass-panel p-8 rounded-2xl max-w-2xl mx-auto">
                                <PremiumSlider
                                    label="Investment Capital (INR)"
                                    value={capital}
                                    onChange={(e) => setCapital(Number(e.target.value))}
                                    min={10000}
                                    max={10000000}
                                    step={5000}
                                    unit="₹"
                                />

                                <div className="mt-8 grid grid-cols-3 gap-4">
                                    {[50000, 500000, 2500000].map(val => (
                                        <button
                                            key={val}
                                            onClick={() => setCapital(val)}
                                            className="py-2 px-4 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--accent-gold)] transition-all text-sm font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                        >
                                            ₹{val.toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-3">Time Horizon</h2>
                                <p className="text-[var(--text-secondary)]">How long do you intend to keep this capital invested?</p>
                            </div>

                            <div className="glass-panel p-8 rounded-2xl max-w-2xl mx-auto">
                                <PremiumSlider
                                    label="Duration (Years)"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    min={1}
                                    max={30}
                                    step={1}
                                />
                                <div className="mt-6 flex justify-between text-sm text-[var(--text-muted)]">
                                    <span>Short Term</span>
                                    <span>Medium Term</span>
                                    <span>Long Term</span>
                                    <span>Generational</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-3">Risk Tolerance</h2>
                                <p className="text-[var(--text-secondary)]">Select the AI risk model that aligns with your psychology.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectionCard
                                    title="Conservative"
                                    description="Prioritize capital preservation. Focus on blue-chip stocks and debt instruments. Low volatility."
                                    selected={risk === "Conservative"}
                                    onClick={() => setRisk("Conservative")}
                                    icon={<div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-green-500 font-bold">C</div>}
                                />
                                <SelectionCard
                                    title="Balanced"
                                    description="Optimized mix of growth and stability. Moderate volatility for consistent returns."
                                    selected={risk === "Balanced"}
                                    onClick={() => setRisk("Balanced")}
                                    icon={<div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">B</div>}
                                />
                                <SelectionCard
                                    title="Growth"
                                    description="Focus on capital appreciation. Higher exposure to mid-cap and emerging sectors."
                                    selected={risk === "Growth"}
                                    onClick={() => setRisk("Growth")}
                                    icon={<div className="w-8 h-8 rounded bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold">G</div>}
                                />
                                <SelectionCard
                                    title="Aggressive"
                                    description="Maximum growth potential. High volatility tolerance for exponential returns."
                                    selected={risk === "Aggressive"}
                                    onClick={() => setRisk("Aggressive")}
                                    icon={<div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-500 font-bold">A</div>}
                                />
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-3">Financial Objectives</h2>
                                <p className="text-[var(--text-secondary)]">What is the primary purpose of this portfolio?</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {["Wealth Creation", "Passive Income", "Retirement", "Education", "Major Purchase", "Speculation"].map((goal) => (
                                    <SelectionCard
                                        key={goal}
                                        title={goal}
                                        description=""
                                        selected={goals.includes(goal)}
                                        onClick={() => {
                                            if (goals.includes(goal)) {
                                                setGoals(goals.filter(g => g !== goal));
                                            } else {
                                                setGoals([...goals, goal]);
                                            }
                                        }}
                                    />
                                ))}

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Actions */}
            <div className="flex justify-between mt-12 pt-8 border-t border-[var(--border)]">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="px-6 py-3 rounded-xl font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={isProcessing}
                    className="px-8 py-3 rounded-xl font-bold bg-[var(--gradient-gold)] text-[var(--bg-primary)] hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="animate-spin" size={20} /> Processing Intelligence...
                        </>
                    ) : (
                        <>
                            {currentStep === 4 ? "Generate Portfolio" : "Next Step"} <ArrowRight size={20} />
                        </>
                    )}

                </button>
            </div>
        </div>
    );
}

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}
