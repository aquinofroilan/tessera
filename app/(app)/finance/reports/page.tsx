import type { Metadata } from "next";
import Link from "next/link";
import { IconChartBar, IconScale, IconTable } from "@tabler/icons-react";

import { Card, CardEyebrow } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";

export const metadata: Metadata = {
    title: "Reports · Loom",
    description: "Income statement, balance sheet, and trial balance.",
};

type ReportLink = {
    href: string;
    title: string;
    description: string;
    icon: typeof IconChartBar;
    disabled?: boolean;
};

const reports: ReportLink[] = [
    {
        href: "/finance/reports/income-statement",
        title: "Income statement",
        description: "Revenue, expenses, and net income for the period.",
        icon: IconChartBar,
    },
    {
        href: "/finance/reports/balance-sheet",
        title: "Balance sheet",
        description: "Assets, liabilities, and equity at a point in time.",
        icon: IconScale,
    },
    {
        href: "/finance/reports/trial-balance",
        title: "Trial balance",
        description: "Every account's debit and credit totals — for verifying the books balance.",
        icon: IconTable,
        disabled: true,
    },
];

export default function ReportsIndexPage() {
    return (
        <>
            <AppTopbar crumbs={[{ label: "Finance", href: "/finance" }, { label: "Reports" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · Reports"
                        title={
                            <>
                                Reports<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Pick a report. All support a comparative period side-by-side."
                    />

                    <Block title="Statements" description="Built from posted journal entries.">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {reports.map((r) => {
                                const Icon = r.icon;
                                const inner = (
                                    <Card
                                        className={
                                            r.disabled
                                                ? "gap-3 p-6 opacity-50"
                                                : "group/report gap-3 p-6 transition-colors hover:border-(--ink) hover:bg-(--paper-2)"
                                        }>
                                        <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--ink-soft) group-hover/report:bg-(--ink) group-hover/report:text-(--paper)">
                                            <Icon className="size-5" stroke={1.6} />
                                        </span>
                                        <div className="flex flex-col gap-1">
                                            <CardEyebrow>{r.disabled ? "Coming soon" : "Report"}</CardEyebrow>
                                            <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">
                                                {r.title}
                                            </div>
                                            <div className="text-sm text-(--muted)">{r.description}</div>
                                        </div>
                                    </Card>
                                );
                                if (r.disabled) {
                                    return <div key={r.href}>{inner}</div>;
                                }
                                return (
                                    <Link key={r.href} href={r.href}>
                                        {inner}
                                    </Link>
                                );
                            })}
                        </div>
                    </Block>
                </div>
            </div>
        </>
    );
}
