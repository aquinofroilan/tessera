import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Finance · Loom",
    description: "Cash position, receivables, payables, and ledger health at a glance.",
};

export default function FinanceDashboardPage() {
    return (
        <div className="mx-auto w-full max-w-300 px-6 py-8 md:px-10 md:py-10">
            <div className="mb-2 font-mono text-[10px] tracking-[0.16em] text-(--muted) uppercase">
                Finance · Dashboard
            </div>
            <h1 className="font-display text-foreground text-[40px] leading-[1.05] font-[330] tracking-[-0.02em]">
                Good morning, <em className="text-(--accent) italic">Emma.</em>
            </h1>
            <p className="mt-3 max-w-140 text-[15px] leading-[1.55] text-(--ink-soft)">
                Here&apos;s where your books stand today. KPI strip, action queues, and trend charts are arriving in
                the next commits.
            </p>
        </div>
    );
}
