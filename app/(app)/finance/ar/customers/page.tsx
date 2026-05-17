import type { Metadata } from "next";
import Link from "next/link";
import { IconDownload, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { PaginationFooter } from "../../_components/PaginationFooter";
import { PartiesTable } from "../../_components/PartiesTable";
import { PartiesToolbar } from "../../_components/PartiesToolbar";
import { listCustomers } from "@/lib/api/finance/customers-dal";
import { countParties, filterParties, paginate, parsePartiesQuery } from "../../_data/parties-query";

export const metadata: Metadata = {
    title: "Customers · Loom",
    description: "Who you bill. Contact, payment terms, and history.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const CustomersListPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const query = parsePartiesQuery(sp);
    const customers = await listCustomers();
    const counts = countParties(customers);
    const filtered = filterParties(customers, query);
    const { rows: pageRows, window } = paginate(filtered, query.page);

    return (
        <>
            <AppTopbar
                crumbs={[{ label: "Finance", href: "/finance" }, { label: "Receivables" }, { label: "Customers" }]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · Receivables"
                        title={
                            <>
                                Customers<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Who you bill. Manage contacts, payment terms, and default revenue routing."
                        actions={
                            <>
                                <Button variant="outline" size="sm">
                                    <IconDownload stroke={1.8} />
                                    Export
                                </Button>
                                <Button asChild variant="default" size="sm">
                                    <Link href="/finance/ar/customers/new">
                                        <IconPlus stroke={1.8} />
                                        New customer
                                    </Link>
                                </Button>
                            </>
                        }
                    />

                    <Block
                        title="All customers"
                        description={`${filtered.length} of ${customers.length} customers match your filters.`}>
                        <div className="mb-5">
                            <PartiesToolbar
                                activeScope={query.scope}
                                initialQ={query.q}
                                counts={counts}
                                searchPlaceholder="Search name, contact, or email…"
                                searchAriaLabel="Search customers"
                            />
                        </div>
                        <PartiesTable
                            rows={pageRows}
                            detailHrefBase="/finance/ar/customers"
                            nameHeader="Customer"
                            emptyHeading="No customers match your filters."
                            emptyDescription="Try clearing the search or switching scope."
                        />
                        {window.total > 0 && <PaginationFooter window={window} />}
                    </Block>
                </div>
            </div>
        </>
    );
};

export default CustomersListPage;
