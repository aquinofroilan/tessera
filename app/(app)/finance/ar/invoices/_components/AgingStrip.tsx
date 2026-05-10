import { Card, CardEyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatMoneyShort } from "../../../_data/format";
import type { AgingSummary } from "../_data/aging";

type Tone = "neutral" | "ochre" | "accent-soft" | "accent" | "ink";

type Bucket = {
    label: string;
    key: keyof AgingSummary["counts"];
    valueKey: "current" | "days1to30" | "days31to60" | "days61to90" | "days90plus" | "total";
    tone: Tone;
};

const buckets: Bucket[] = [
    { label: "Current", key: "current", valueKey: "current", tone: "neutral" },
    { label: "1–30 days", key: "days1to30", valueKey: "days1to30", tone: "neutral" },
    { label: "31–60 days", key: "days31to60", valueKey: "days31to60", tone: "ochre" },
    { label: "61–90 days", key: "days61to90", valueKey: "days61to90", tone: "accent-soft" },
    { label: "90+ days", key: "days90plus", valueKey: "days90plus", tone: "accent" },
    { label: "Total open", key: "total", valueKey: "total", tone: "ink" },
];

const toneRing: Record<Tone, string> = {
    neutral: "",
    ochre: "before:bg-(--ochre)",
    "accent-soft": "before:bg-(--accent-light)",
    accent: "before:bg-(--accent)",
    ink: "before:bg-(--ink)",
};

export function AgingStrip({ summary, currencyCode }: { summary: AgingSummary; currencyCode: string }) {
    return (
        <section
            aria-label="Accounts receivable aging"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {buckets.map((b) => {
                const value = summary.bucket[b.valueKey];
                const count = summary.counts[b.key];
                const isTotal = b.key === "total";
                return (
                    <Card
                        key={b.key}
                        className={cn(
                            "relative gap-2 overflow-hidden p-4 before:absolute before:top-0 before:left-0 before:h-full before:w-0.75 before:content-['']",
                            toneRing[b.tone],
                            isTotal && "bg-(--paper-2)",
                        )}>
                        <CardEyebrow>{b.label}</CardEyebrow>
                        <div className="font-display text-foreground text-[26px] leading-none font-[330] tracking-[-0.02em] tabular-nums">
                            {formatMoneyShort(value, currencyCode)}
                        </div>
                        <div className="font-mono text-[11px] text-(--muted) tabular-nums">
                            {count} {count === 1 ? "invoice" : "invoices"}
                        </div>
                    </Card>
                );
            })}
        </section>
    );
}
