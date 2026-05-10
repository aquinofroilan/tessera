import type { Metadata } from "next";
import Link from "next/link";
import { IconDownload, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { MOCK_TODAY } from "../../_data/mock-anchor";
import { AgingStrip } from "./_components/AgingStrip";
import { BillsTable } from "./_components/BillsTable";
import { BillsToolbar } from "./_components/BillsToolbar";
import { PaginationFooter } from "../../_components/PaginationFooter";
import { deriveApAgingSummary } from "./_data/aging";
import { countByStatus, filterBills, paginate, parseBillsQuery } from "./_data/filter";
import { bills } from "./_data/bills-mock";

export const metadata: Metadata = {
    title: "Bills · Loom",
    description: "All money out. Filter by status, search by number or vendor.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BillsListPage({ searchParams }: Props) {
    const sp = await searchParams;
    const query = parseBillsQuery(sp);
    const counts = countByStatus(bills);
    const filtered = filterBills(bills, query);
    const { rows: pageRows, window } = paginate(filtered, query.page);
    const aging = deriveApAgingSummary(bills, MOCK_TODAY);

    return (
        <>
            <AppTopbar crumbs={[{ label: "Finance", href: "/finance" }, { label: "Payables" }, { label: "Bills" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · Payables"
                        title={
                            <>
                                Bills<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="All money out. Filter by status, search by number or vendor, and stay ahead of what's due."
                        actions={
                            <>
                                <Button variant="outline" size="sm">
                                    <IconDownload stroke={1.8} />
                                    Export
                                </Button>
                                <Button asChild variant="default" size="sm">
                                    <Link href="/finance/ap/bills/new">
                                        <IconPlus stroke={1.8} />
                                        New bill
                                    </Link>
                                </Button>
                            </>
                        }
                    />

                    <Block title="AP aging" description="Open payables grouped by how far past due they are.">
                        <AgingStrip summary={aging} currencyCode="USD" />
                    </Block>

                    <Block
                        title="All bills"
                        description={`${filtered.length} of ${bills.length} bills match your filters.`}>
                        <div className="mb-5">
                            <BillsToolbar activeStatus={query.status} initialQ={query.q} counts={counts} />
                        </div>
                        <BillsTable rows={pageRows} asOfDate={MOCK_TODAY} />
                        {window.total > 0 && <PaginationFooter window={window} />}
                    </Block>
                </div>
            </div>
        </>
    );
}
