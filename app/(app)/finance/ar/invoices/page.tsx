import type { Metadata } from "next";
import Link from "next/link";
import { IconDownload, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { AgingStrip } from "./_components/AgingStrip";
import { InvoicesToolbar } from "./_components/InvoicesToolbar";
import { deriveAgingSummary } from "./_data/aging";
import { countByStatus, filterInvoices, parseInvoicesQuery } from "./_data/filter";
import { invoices } from "./_data/invoices-mock";

export const metadata: Metadata = {
    title: "Invoices · Loom",
    description: "All money in. Filter by status, search by number or customer.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function InvoicesListPage({ searchParams }: Props) {
    const sp = await searchParams;
    const query = parseInvoicesQuery(sp);
    const counts = countByStatus(invoices);
    const filtered = filterInvoices(invoices, query);
    const aging = deriveAgingSummary(invoices);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Finance", href: "/finance" },
                    { label: "Receivables" },
                    { label: "Invoices" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 px-9 py-9">
                    <PageHeader
                        eyebrow="Finance · Receivables"
                        title={
                            <>
                                Invoices<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="All money in. Filter by status, search by number or customer, and act on what's overdue."
                        actions={
                            <>
                                <Button variant="outline" size="sm">
                                    <IconDownload stroke={1.8} />
                                    Export
                                </Button>
                                <Button asChild variant="default" size="sm">
                                    <Link href="/finance/ar/invoices/new">
                                        <IconPlus stroke={1.8} />
                                        New invoice
                                    </Link>
                                </Button>
                            </>
                        }
                    />

                    <Block
                        title="AR aging"
                        description="Open receivables grouped by how far past due they are.">
                        <AgingStrip summary={aging} currencyCode="USD" />
                    </Block>

                    <Block
                        title="All invoices"
                        description={`${filtered.length} of ${invoices.length} invoices match your filters.`}>
                        <InvoicesToolbar activeStatus={query.status} initialQ={query.q} counts={counts} />
                    </Block>
                </div>
            </div>
        </>
    );
}
