import type { Metadata } from "next";

import { Button } from "@/components/ui";
import { AppTopbar } from "../_components/AppTopbar";
import { Block } from "../_components/Block";
import { PageHeader } from "../_components/PageHeader";
import { KpiStrip } from "./_components/KpiStrip";
import { orgGreeting } from "./_data/mock";

export const metadata: Metadata = {
    title: "Finance · Loom",
    description: "Cash position, receivables, payables, and ledger health at a glance.",
};

export default function FinanceDashboardPage() {
    return (
        <>
            <AppTopbar crumbs={[{ label: "Finance", href: "/finance" }, { label: "Dashboard" }]} />
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
            </div>
        </>
    );
}
