import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui";
import { AppTopbar } from "../_components/AppTopbar";
import { Block } from "../_components/Block";
import { PageHeader } from "../_components/PageHeader";
import { KpiStrip } from "./_components/KpiStrip";
import { PayablesQueue } from "./_components/PayablesQueue";
import { ReceivablesQueue } from "./_components/ReceivablesQueue";
import { RecentJournal } from "./_components/RecentJournal";
import { RevenueTrend } from "./_components/RevenueTrend";
import { orgGreeting } from "./_data/mock";

export const metadata: Metadata = {
    title: "Finance · Loom",
    description: "Cash position, receivables, payables, and ledger health at a glance.",
};

export default function FinanceDashboardPage() {
    return (
        <>
            <AppTopbar crumbs={[{ label: "Finance", href: "/finance" }, { label: "Dashboard" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 px-9 py-9">
                <PageHeader
                    eyebrow={`Finance · ${orgGreeting.fiscalYearLabel}`}
                    title={
                        <>
                            Good morning, <em className="text-(--accent) italic">{orgGreeting.name}.</em>
                        </>
                    }
                    description={`Where the books stand at ${orgGreeting.organization} today — overdue, in-flight, and trending.`}
                    actions={
                        <Button variant="outline" size="sm">
                            Export
                        </Button>
                    }
                />

                <Block
                    title="At a glance"
                    description="Money in, money out, and what needs your attention this week.">
                    <KpiStrip />
                </Block>

                <Block
                    title="Receivables"
                    description="Invoices that are overdue, partially paid, or close to due."
                    aside={
                        <Button asChild variant="outline" size="sm">
                            <Link href="/finance/ar/invoices">View all</Link>
                        </Button>
                    }>
                    <ReceivablesQueue />
                </Block>

                <Block
                    title="Payables"
                    description="Bills you should approve or pay before they slip past due."
                    aside={
                        <Button asChild variant="outline" size="sm">
                            <Link href="/finance/ap/bills">View all</Link>
                        </Button>
                    }>
                    <PayablesQueue />
                </Block>

                <Block
                    title="Revenue trend"
                    description="Revenue against expenses over the last six months."
                    aside={
                        <Button asChild variant="outline" size="sm">
                            <Link href="/finance/reports/income-statement">Income statement</Link>
                        </Button>
                    }>
                    <RevenueTrend />
                </Block>

                <Block
                    title="Recent journal"
                    description="Latest postings and drafts that may need a second pair of eyes."
                    aside={
                        <Button asChild variant="outline" size="sm">
                            <Link href="/finance/journal">Open journal</Link>
                        </Button>
                    }>
                    <RecentJournal />
                </Block>
                </div>
            </div>
        </>
    );
}
