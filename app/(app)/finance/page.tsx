import type { Metadata } from "next";
import { KpiStrip } from "./_components/KpiStrip";
import { orgGreeting } from "./_data/mock";

export const metadata: Metadata = {
    title: "Finance · Loom",
    description: "Cash position, receivables, payables, and ledger health at a glance.",
};

export default function FinanceDashboardPage() {
    return (
        <div className="mx-auto w-full max-w-300 px-6 py-8 md:px-10 md:py-10">
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="mb-2 font-mono text-[10px] tracking-[0.16em] text-(--muted) uppercase">
                        Finance · Dashboard
                    </div>
                    <h1 className="font-display text-foreground text-[40px] leading-[1.05] font-[330] tracking-[-0.02em]">
                        Good morning, <em className="text-(--accent) italic">{orgGreeting.name}.</em>
                    </h1>
                    <p className="mt-2 max-w-140 text-[15px] leading-[1.55] text-(--ink-soft)">
                        Where the books stand at {orgGreeting.organization} — {orgGreeting.fiscalYearLabel}.
                    </p>
                </div>
            </header>

            <KpiStrip />
        </div>
    );
}
