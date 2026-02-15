import { Sidebar } from "@/components/layout/Sidebar";
import { DecisionView } from "@/components/decision/DecisionView";

export default function DecisionPage() {
    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)]">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-6 overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-8">
                    <DecisionView />
                </div>
            </main>
        </div>
    );
}
