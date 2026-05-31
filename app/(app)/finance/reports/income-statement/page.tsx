import type { Metadata } from "next";
import { format, parseISO, startOfYear, subYears } from "date-fns";
import { IconDownload } from "@tabler/icons-react";

import { Button, Card } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { formatMoney } from "../../_data/format";
import { ComparativeToggle } from "../_components/ComparativeToggle";
import { ReportSection } from "../_components/ReportSection";
import { getIncomeStatement } from "@/lib/api/finance/reports-dal";

export const metadata: Metadata = {
    title: "Income statement · Tessera",
    description: "Revenue earned, expenses incurred, net income for the period.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function fmtRange(start: string, end: string) {
    return `${format(parseISO(start), "MMM d, yyyy")} – ${format(parseISO(end), "MMM d, yyyy")}`;
}

const IncomeStatementPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const compareRaw = Array.isArray(sp.compare) ? sp.compare[0] : sp.compare;
    const showComparative = compareRaw === "1";

    const today = new Date();
    const startDate = format(startOfYear(today), "yyyy-MM-dd");
    const endDate = format(today, "yyyy-MM-dd");
    const report = await getIncomeStatement({
        startDate,
        endDate,
        ...(showComparative
            ? {
                  compareStartDate: format(startOfYear(subYears(today, 1)), "yyyy-MM-dd"),
                  compareEndDate: format(subYears(today, 1), "yyyy-MM-dd"),
              }
            : {}),
    });

    return (
        <>
            <AppTopbar
                crumbs={[{ label: "Finance", href: "/finance" }, { label: "Reports" }, { label: "Income statement" }]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · Reports"
                        title={
                            <>
                                Income statement<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description={
                            showComparative && report.comparativePeriod
                                ? `${fmtRange(report.startDate, report.endDate)} · vs ${fmtRange(report.comparativePeriod.startDate, report.comparativePeriod.endDate)}`
                                : fmtRange(report.startDate, report.endDate)
                        }
                        actions={
                            <Button variant="outline" size="sm">
                                <IconDownload stroke={1.8} />
                                Export
                            </Button>
                        }
                    />

                    <Block title="Period" description="Toggle a comparative period side-by-side.">
                        <ComparativeToggle active={showComparative} />
                    </Block>

                    <Block title="Revenue" description="Money earned through normal operations.">
                        <ReportSection
                            title="Revenue"
                            lines={report.revenue}
                            total={report.totalRevenue}
                            comparativeTotal={report.comparativeTotalRevenue}
                            showComparative={showComparative}
                            currencyCode="USD"
                        />
                    </Block>

                    <Block title="Expenses" description="Costs incurred to earn that revenue.">
                        <ReportSection
                            title="Expenses"
                            lines={report.expenses}
                            total={report.totalExpenses}
                            comparativeTotal={report.comparativeTotalExpenses}
                            showComparative={showComparative}
                            currencyCode="USD"
                        />
                    </Block>

                    <Block title="Net income" description="Revenue minus expenses for the period.">
                        <Card className="grid grid-cols-[1fr_140px_140px] items-center gap-3 border border-(--ink) bg-(--ink) px-6 py-4 text-(--paper)">
                            <span className="font-display text-[18px] font-[380] tracking-[-0.01em]">Net income</span>
                            <span className="font-display text-right text-[24px] font-[380] tracking-[-0.02em] tabular-nums">
                                {formatMoney(report.netIncome, "USD")}
                            </span>
                            <span
                                className={
                                    showComparative
                                        ? "text-right font-mono text-[15px] text-(--paper)/70 tabular-nums"
                                        : "invisible"
                                }>
                                {report.comparativeNetIncome !== null
                                    ? formatMoney(report.comparativeNetIncome, "USD")
                                    : "—"}
                            </span>
                        </Card>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default IncomeStatementPage;
