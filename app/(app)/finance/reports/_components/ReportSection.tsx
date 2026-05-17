import Link from "next/link";

import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Money } from "@/lib/api/types";
import type { ReportAccountLine } from "@/lib/api/finance/reports";
import { formatMoney } from "../../_data/format";

type ReportSectionProps = {
    title: string;
    lines: ReportAccountLine[];
    total: Money;
    comparativeTotal: Money | null;
    showComparative: boolean;
    currencyCode: string;
    accountHrefBase?: string;
    emphasis?: "subtle" | "strong";
};

export function ReportSection({
    title,
    lines,
    total,
    comparativeTotal,
    showComparative,
    currencyCode,
    accountHrefBase = "/finance/accounts",
    emphasis = "subtle",
}: ReportSectionProps) {
    return (
        <Card className="p-0">
            <div className="border-b border-(--rule-soft) px-6 py-3">
                <span className="font-mono text-[10px] tracking-[0.16em] text-(--muted) uppercase">{title}</span>
            </div>
            <div className="flex flex-col">
                {lines.map((line) => (
                    <div
                        key={`${line.accountId}-${line.accountCode}`}
                        className="grid grid-cols-[110px_1fr_140px_140px] items-center gap-3 border-b border-(--rule-soft) px-6 py-2.5 last:border-b-0">
                        <span className="font-mono text-[12px] tracking-[0.04em] text-(--muted)">
                            {line.isSynthetic ? "" : line.accountCode}
                        </span>
                        <span
                            className={cn("text-[14px] text-(--ink)", line.isSynthetic && "text-(--ink-soft) italic")}>
                            {line.isSynthetic || !accountHrefBase ? (
                                line.accountName
                            ) : (
                                <Link href={`${accountHrefBase}/${line.accountId}`} className="hover:text-(--accent)">
                                    {line.accountName}
                                </Link>
                            )}
                        </span>
                        <span className="text-right font-mono text-[13px] tabular-nums">
                            {formatMoney(line.amount, currencyCode)}
                        </span>
                        <span
                            className={cn(
                                "text-right font-mono text-[13px] text-(--muted) tabular-nums",
                                !showComparative && "invisible",
                            )}>
                            {line.comparativeAmount !== null ? formatMoney(line.comparativeAmount, currencyCode) : "—"}
                        </span>
                    </div>
                ))}
            </div>
            <div
                className={cn(
                    "grid grid-cols-[110px_1fr_140px_140px] items-center gap-3 border-t px-6 py-3",
                    emphasis === "strong"
                        ? "border-(--ink) bg-(--paper-2) font-medium"
                        : "border-(--rule) bg-(--paper)/50",
                )}>
                <span />
                <span className="font-display text-[15px] font-[420] tracking-[-0.005em] text-(--ink)">
                    Total {title.toLowerCase()}
                </span>
                <span className="text-right font-mono text-[14px] font-medium tabular-nums">
                    {formatMoney(total, currencyCode)}
                </span>
                <span
                    className={cn(
                        "text-right font-mono text-[14px] text-(--muted) tabular-nums",
                        !showComparative && "invisible",
                    )}>
                    {comparativeTotal !== null ? formatMoney(comparativeTotal, currencyCode) : "—"}
                </span>
            </div>
        </Card>
    );
}
