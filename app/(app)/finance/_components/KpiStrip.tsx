import { IconArrowDownRight, IconArrowUpRight, IconMinus } from "@tabler/icons-react";
import { Card, CardEyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatDelta, formatMoneyShort } from "../_data/format";
import type { Kpi, KpiTone } from "../_data/types";
import { kpis } from "../_data/mock";

const toneRing: Record<KpiTone, string> = {
    neutral: "",
    positive: "before:bg-(--moss)",
    warning: "before:bg-(--ochre)",
    accent: "before:bg-(--accent)",
};

function deltaPresentation(delta: number | null) {
    if (delta === null) return { Icon: IconMinus, className: "text-(--muted)" };
    if (delta > 0) return { Icon: IconArrowUpRight, className: "text-(--moss)" };
    if (delta < 0) return { Icon: IconArrowDownRight, className: "text-(--accent)" };
    return { Icon: IconMinus, className: "text-(--muted)" };
}

function KpiTile({ kpi }: { kpi: Kpi }) {
    const tone = kpi.tone ?? "neutral";
    const value = kpi.currencyCode ? formatMoneyShort(kpi.value, kpi.currencyCode) : kpi.value;
    const { Icon, className } = deltaPresentation(kpi.delta);

    return (
        <Card
            className={cn(
                "relative gap-3 overflow-hidden p-5 before:absolute before:top-0 before:left-0 before:h-full before:w-0.75 before:content-['']",
                toneRing[tone],
            )}>
            <CardEyebrow>{kpi.label}</CardEyebrow>
            <div className="font-display text-foreground text-[34px] leading-none font-[330] tracking-[-0.02em] tabular-nums">
                {value}
            </div>
            <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] text-(--ink-soft)">{kpi.detail}</span>
                {kpi.delta !== null && (
                    <span
                        className={cn(
                            "inline-flex items-center gap-0.5 font-mono text-[11px] tabular-nums",
                            className,
                        )}>
                        <Icon className="size-3.5" stroke={2} />
                        {formatDelta(kpi.delta)}
                    </span>
                )}
            </div>
        </Card>
    );
}

export function KpiStrip() {
    return (
        <section
            aria-label="Key performance indicators"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {kpis.map((kpi) => (
                <KpiTile key={kpi.label} kpi={kpi} />
            ))}
        </section>
    );
}
