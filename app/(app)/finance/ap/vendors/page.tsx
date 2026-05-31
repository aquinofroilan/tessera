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
import { listVendors } from "@/lib/api/finance/vendors-dal";
import { countParties, filterParties, paginate, parsePartiesQuery } from "../../_data/parties-query";

export const metadata: Metadata = {
    title: "Vendors · Tessera",
    description: "Who bills you. Contact, payment terms, and history.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const VendorsListPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const query = parsePartiesQuery(sp);
    const vendors = await listVendors();
    const counts = countParties(vendors);
    const filtered = filterParties(vendors, query);
    const { rows: pageRows, window } = paginate(filtered, query.page);

    return (
        <>
            <AppTopbar crumbs={[{ label: "Finance", href: "/finance" }, { label: "Payables" }, { label: "Vendors" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · Payables"
                        title={
                            <>
                                Vendors<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Who bills you. Manage contacts, payment terms, and default expense routing."
                        actions={
                            <>
                                <Button variant="outline" size="sm">
                                    <IconDownload stroke={1.8} />
                                    Export
                                </Button>
                                <Button asChild variant="default" size="sm">
                                    <Link href="/finance/ap/vendors/new">
                                        <IconPlus stroke={1.8} />
                                        New vendor
                                    </Link>
                                </Button>
                            </>
                        }
                    />

                    <Block
                        title="All vendors"
                        description={`${filtered.length} of ${vendors.length} vendors match your filters.`}>
                        <div className="mb-5">
                            <PartiesToolbar
                                activeScope={query.scope}
                                initialQ={query.q}
                                counts={counts}
                                searchPlaceholder="Search name, contact, or email…"
                                searchAriaLabel="Search vendors"
                            />
                        </div>
                        <PartiesTable
                            rows={pageRows}
                            detailHrefBase="/finance/ap/vendors"
                            nameHeader="Vendor"
                            emptyHeading="No vendors match your filters."
                            emptyDescription="Try clearing the search or switching scope."
                        />
                        {window.total > 0 && <PaginationFooter window={window} />}
                    </Block>
                </div>
            </div>
        </>
    );
};

export default VendorsListPage;
