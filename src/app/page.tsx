"use client";

import Link from "next/link";
import { ArrowRight, BarChart2, ShieldCheck, BrainCircuit, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-highlight)] bg-[rgba(212,175,55,0.05)] text-[var(--accent-gold)] text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)] animate-pulse"></span>
          Institutional AI Architecture v1.0 Live
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-[var(--text-secondary)]"
        >
          Intelligence Beyond <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-[var(--gradient-gold)]">Human Capacity</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mb-10 leading-relaxed"
        >
          The world's first autonomous investment operating system.
          Process millions of data points across global markets in real-time.
          Institutional-grade infrastructure for the modern investor.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/dashboard" className="px-8 py-4 rounded-xl font-bold bg-[var(--gradient-gold)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity flex items-center gap-2">
            Launch Terminal <ArrowRight size={20} />
          </Link>
          <Link href="/market" className="px-8 py-4 rounded-xl font-bold border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors">
            View Market Data
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BrainCircuit className="text-[var(--accent-teal)]" size={32} />}
            title="Neural Forecasting"
            description="Predictive models trained on 50 years of global financial data."
            delay={0.4}
          />
          <FeatureCard
            icon={<ShieldCheck className="text-[var(--accent-gold)]" size={32} />}
            title="Risk Architecture"
            description="Real-time volatility analysis and drawdown simulations."
            delay={0.5}
          />
          <FeatureCard
            icon={<Globe className="text-[var(--accent-blue)]" size={32} />}
            title="Global Synthesis"
            description="Simultaneous scanning of NSE, BSE, and global macro indicators."
            delay={0.6}
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="p-8 rounded-2xl glass-panel group hover:border-[var(--border-highlight)] transition-colors"
    >
      <div className="mb-6 p-4 rounded-xl bg-[var(--bg-card)] inline-flex group-hover:bg-[var(--bg-card-hover)] transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{title}</h3>
      <p className="text-[var(--text-secondary)] leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
