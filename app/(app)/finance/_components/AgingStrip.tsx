import { Card, CardEyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { AgingSummary } from "../_data/aging";
import { formatMoneyShort } from "../_data/format";

type Tone = "neutral" | "ochre" | "accent-soft" | "accent" | "ink";

type Bucket = {
    label: string;
    key: keyof AgingSummary["counts"];
    valueKey: "current" | "days1to30" | "days31to60" | "days61to90" | "days90plus" | "total";
    tone: Tone;
};

const toneRing: Record<Tone, string> = {
    neutral: "",
    ochre: "before:bg-(--ochre)",
    "accent-soft": "before:bg-(--accent-light)",
    accent: "before:bg-(--accent)",
    ink: "before:bg-(--ink)",
};

const baseBuckets = (totalLabel: string): Bucket[] => [
    { label: "Current", key: "current", valueKey: "current", tone: "neutral" },
    { label: "1–30 days", key: "days1to30", valueKey: "days1to30", tone: "neutral" },
    { label: "31–60 days", key: "days31to60", valueKey: "days31to60", tone: "ochre" },
    { label: "61–90 days", key: "days61to90", valueKey: "days61to90", tone: "accent-soft" },
    { label: "90+ days", key: "days90plus", valueKey: "days90plus", tone: "accent" },
    { label: totalLabel, key: "total", valueKey: "total", tone: "ink" },
];

type AgingStripProps = {
    summary: AgingSummary;
    currencyCode: string;
    ariaLabel: string;
    totalLabel: string;
    countNoun: { one: string; other: string };
};

export function AgingStrip({ summary, currencyCode, ariaLabel, totalLabel, countNoun }: AgingStripProps) {
    const buckets = baseBuckets(totalLabel);
    return (
        <section aria-label={ariaLabel} className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
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
                            {count} {count === 1 ? countNoun.one : countNoun.other}
                        </div>
                    </Card>
                );
            })}
        </section>
    );
}
