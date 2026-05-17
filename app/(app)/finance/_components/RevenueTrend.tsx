"use client";

import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import { Card, ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui";
import { formatDelta, formatMoneyShort } from "../_data/format";
import { revenueTrend } from "../_data/mock";

const chartConfig = {
    revenue: { label: "Revenue", color: "var(--accent)" },
    expenses: { label: "Expenses", color: "var(--moss)" },
} satisfies ChartConfig;

export function RevenueTrend() {
    const last = revenueTrend[revenueTrend.length - 1];
    const prev = revenueTrend[revenueTrend.length - 2];
    const delta = (last.revenue - prev.revenue) / prev.revenue;

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
                        <span
                            className={`font-mono text-[11px] tabular-nums ${delta >= 0 ? "text-(--moss)" : "text-(--accent)"}`}>
                            {formatDelta(delta)} MoM
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

            <ChartContainer config={chartConfig} className="h-56 w-full px-2 pb-2">
                <AreaChart accessibilityLayer data={revenueTrend} margin={{ top: 12, right: 16, left: 0, bottom: 4 }}>
                    <defs>
                        <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.22} />
                            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--rule-soft)" />
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{
                            fill: "var(--muted)",
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            letterSpacing: "0.12em",
                        }}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        width={56}
                        tickFormatter={(v: number) => formatMoneyShort(String(v), "USD")}
                        tick={{
                            fill: "var(--muted)",
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                        }}
                    />
                    <ChartTooltip
                        cursor={{ stroke: "var(--rule)", strokeDasharray: "3 3" }}
                        content={
                            <ChartTooltipContent
                                formatter={(value, name) => (
                                    <div className="flex w-full min-w-32 items-center justify-between gap-3">
                                        <span className="flex items-center gap-1.5">
                                            <span
                                                className="size-2 rounded-full"
                                                style={{
                                                    background: name === "revenue" ? "var(--accent)" : "var(--moss)",
                                                }}
                                            />
                                            <span className="text-(--ink-soft)">
                                                {chartConfig[name as keyof typeof chartConfig]?.label ?? name}
                                            </span>
                                        </span>
                                        <span className="font-mono text-(--ink) tabular-nums">
                                            {formatMoneyShort(String(value), "USD")}
                                        </span>
                                    </div>
                                )}
                            />
                        }
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--accent)"
                        strokeWidth={1.8}
                        fill="url(#revenueFill)"
                    />
                    <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="var(--moss)"
                        strokeWidth={1.4}
                        strokeDasharray="3 3"
                        dot={false}
                    />
                </AreaChart>
            </ChartContainer>
        </Card>
    );
}
