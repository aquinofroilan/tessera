import type { Metadata } from "next";
import Link from "next/link";
import { IconDownload, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";

export const metadata: Metadata = {
    title: "Invoices · Loom",
    description: "All money in. Filter by status, search by number or customer.",
};

export default function InvoicesListPage() {
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
                </div>
            </div>
        </>
    );
}
