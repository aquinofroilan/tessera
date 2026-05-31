import type { Metadata } from "next";
import { format, parseISO, subYears } from "date-fns";
import { IconDownload } from "@tabler/icons-react";

import { Button, Card } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { formatMoney } from "../../_data/format";
import { ComparativeToggle } from "../_components/ComparativeToggle";
import { ReportSection } from "../_components/ReportSection";
import { getBalanceSheet } from "@/lib/api/finance/reports-dal";

export const metadata: Metadata = {
    title: "Balance sheet · Tessera",
    description: "Assets, liabilities, and equity at a point in time.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function fmtDate(iso: string) {
    return format(parseISO(iso), "MMM d, yyyy");
}

const BalanceSheetPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const compareRaw = Array.isArray(sp.compare) ? sp.compare[0] : sp.compare;
    const showComparative = compareRaw === "1";

    const today = new Date();
    const asOfDate = format(today, "yyyy-MM-dd");
    const report = await getBalanceSheet({
        asOfDate,
        ...(showComparative ? { compareAsOfDate: format(subYears(today, 1), "yyyy-MM-dd") } : {}),
    });

    return (
        <>
            <AppTopbar
                crumbs={[{ label: "Finance", href: "/finance" }, { label: "Reports" }, { label: "Balance sheet" }]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · Reports"
                        title={
                            <>
                                Balance sheet<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description={
                            showComparative && report.comparativeAsOfDate
                                ? `As of ${fmtDate(report.asOfDate)} · vs ${fmtDate(report.comparativeAsOfDate)}`
                                : `As of ${fmtDate(report.asOfDate)}`
                        }
                        actions={
                            <Button variant="outline" size="sm">
                                <IconDownload stroke={1.8} />
                                Export
                            </Button>
                        }
                    />

                    <Block title="Period" description="Toggle a comparative date side-by-side.">
                        <div className="flex flex-wrap items-center gap-3">
                            <ComparativeToggle active={showComparative} />
                            <span
                                className={
                                    report.isBalanced
                                        ? "rounded-full bg-(--moss-soft) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--moss) uppercase"
                                        : "rounded-full bg-(--accent-soft) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--accent-deep) uppercase"
                                }>
                                {report.isBalanced
                                    ? "Balanced"
                                    : `Out of balance by ${formatMoney(report.outOfBalanceAmount, "USD")}`}
                            </span>
                        </div>
                    </Block>

                    <Block title="Assets" description="What the business owns.">
                        <ReportSection
                            title="Assets"
                            lines={report.assets}
                            total={report.totalAssets}
                            comparativeTotal={report.comparativeTotalAssets}
                            showComparative={showComparative}
                            currencyCode="USD"
                        />
                    </Block>

                    <Block title="Liabilities" description="What the business owes.">
                        <ReportSection
                            title="Liabilities"
                            lines={report.liabilities}
                            total={report.totalLiabilities}
                            comparativeTotal={report.comparativeTotalLiabilities}
                            showComparative={showComparative}
                            currencyCode="USD"
                        />
                    </Block>

                    <Block title="Equity" description="Owners' residual claim, including period-to-date earnings.">
                        <ReportSection
                            title="Equity"
                            lines={report.equity}
                            total={report.totalEquity}
                            comparativeTotal={report.comparativeTotalEquity}
                            showComparative={showComparative}
                            currencyCode="USD"
                        />
                    </Block>

                    <Block title="Total liabilities + equity" description="Should equal total assets when balanced.">
                        <Card className="grid grid-cols-[1fr_140px_140px] items-center gap-3 border border-(--ink) bg-(--ink) px-6 py-4 text-(--paper)">
                            <span className="font-display text-[18px] font-[380] tracking-[-0.01em]">
                                Liabilities + equity
                            </span>
                            <span className="font-display text-right text-[24px] font-[380] tracking-[-0.02em] tabular-nums">
                                {formatMoney(report.totalLiabilitiesAndEquity, "USD")}
                            </span>
                            <span
                                className={
                                    showComparative
                                        ? "text-right font-mono text-[15px] text-(--paper)/70 tabular-nums"
                                        : "invisible"
                                }>
                                {report.comparativeTotalLiabilitiesAndEquity !== null
                                    ? formatMoney(report.comparativeTotalLiabilitiesAndEquity, "USD")
                                    : "—"}
                            </span>
                        </Card>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default BalanceSheetPage;
