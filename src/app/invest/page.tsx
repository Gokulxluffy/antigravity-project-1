import { Header } from "@/components/layout/Header";
import { InvestmentForm } from "@/components/invest/InvestmentForm";

export default function InvestPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold mb-4">Initialize Investment Strategy</h1>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Our AI will analyze 50+ data points across the Indian market to construct the optimal portfolio for your parameters.
                    </p>
                </div>

                <InvestmentForm />
            </div>
        </div>
    );
}
