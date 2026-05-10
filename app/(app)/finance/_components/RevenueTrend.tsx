import { Card } from "@/components/ui";
import { formatMoneyShort } from "../_data/format";
import { revenueTrend } from "../_data/mock";

const VIEWBOX_W = 640;
const VIEWBOX_H = 200;
const PADDING_X = 24;
const PADDING_Y = 24;

function buildPath(values: number[], min: number, max: number) {
    const range = max - min || 1;
    const stepX = (VIEWBOX_W - PADDING_X * 2) / (values.length - 1);
    return values
        .map((v, i) => {
            const x = PADDING_X + i * stepX;
            const y = VIEWBOX_H - PADDING_Y - ((v - min) / range) * (VIEWBOX_H - PADDING_Y * 2);
            return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
        })
        .join(" ");
}

function buildAreaPath(values: number[], min: number, max: number) {
    const range = max - min || 1;
    const stepX = (VIEWBOX_W - PADDING_X * 2) / (values.length - 1);
    const baselineY = VIEWBOX_H - PADDING_Y;
    const points = values.map((v, i) => {
        const x = PADDING_X + i * stepX;
        const y = VIEWBOX_H - PADDING_Y - ((v - min) / range) * (VIEWBOX_H - PADDING_Y * 2);
        return [x, y] as const;
    });
    const top = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
    const last = points[points.length - 1];
    const first = points[0];
    return `${top} L ${last[0].toFixed(2)} ${baselineY} L ${first[0].toFixed(2)} ${baselineY} Z`;
}

export function RevenueTrend() {
    const revenues = revenueTrend.map((p) => p.revenue);
    const expenses = revenueTrend.map((p) => p.expenses);
    const all = [...revenues, ...expenses];
    const min = Math.min(...all) * 0.85;
    const max = Math.max(...all) * 1.05;

    const revenuePath = buildPath(revenues, min, max);
    const revenueArea = buildAreaPath(revenues, min, max);
    const expensesPath = buildPath(expenses, min, max);

    const last = revenueTrend[revenueTrend.length - 1];
    const prev = revenueTrend[revenueTrend.length - 2];
    const delta = ((last.revenue - prev.revenue) / prev.revenue) * 100;

    const stepX = (VIEWBOX_W - PADDING_X * 2) / (revenueTrend.length - 1);

    return (
        <Card className="overflow-hidden p-0">
            <div className="flex flex-wrap items-end justify-between gap-4 px-6 pt-5 pb-2">
                <div>
                    <div className="font-mono text-[10px] tracking-[0.16em] text-(--muted) uppercase">
                        Last 6 months
                    </div>
                    <div className="mt-1 flex items-baseline gap-3">
                        <span className="font-display text-foreground text-[26px] leading-none font-[330] tracking-[-0.02em] tabular-nums">
                            {formatMoneyShort(String(last.revenue), "USD")}
                        </span>
                        <span className="font-mono text-[11px] text-(--moss) tabular-nums">
                            +{delta.toFixed(1)}% MoM
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.1em] text-(--muted) uppercase">
                    <span className="inline-flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-(--accent)" />
                        Revenue
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-(--moss)" />
                        Expenses
                    </span>
                </div>
            </div>

            <svg
                viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
                preserveAspectRatio="none"
                className="block h-50 w-full"
                role="img"
                aria-label="Revenue and expenses, last six months">
                <defs>
                    <linearGradient id="revenueArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(185 58 29 / 18%)" />
                        <stop offset="100%" stopColor="rgb(185 58 29 / 0%)" />
                    </linearGradient>
                </defs>
                <path d={revenueArea} fill="url(#revenueArea)" />
                <path d={revenuePath} fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinejoin="round" />
                <path
                    d={expensesPath}
                    fill="none"
                    stroke="var(--moss)"
                    strokeWidth={1.4}
                    strokeDasharray="3 3"
                    strokeLinejoin="round"
                />
                {revenueTrend.map((p, i) => (
                    <text
                        key={p.label}
                        x={PADDING_X + i * stepX}
                        y={VIEWBOX_H - 6}
                        textAnchor="middle"
                        className="fill-(--muted) font-mono text-[9px] tracking-[0.12em] uppercase">
                        {p.label}
                    </text>
                ))}
            </svg>
        </Card>
    );
}
