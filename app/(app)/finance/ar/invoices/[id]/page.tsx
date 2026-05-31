import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { IconPackageExport } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../../../_components/AppTopbar";
import { Block } from "../../../../_components/Block";
import { PageHeader } from "../../../../_components/PageHeader";
import { StatusBadge } from "../../../_components/StatusBadge";
import { invoiceReceipts, invoices } from "../_data/invoices-mock";
import { InvoiceActionBar } from "./_components/InvoiceActionBar";
import { InvoiceLinesTable } from "./_components/InvoiceLinesTable";
import { InvoiceReceiptsTable } from "./_components/InvoiceReceiptsTable";
import { InvoiceSummaryCard } from "./_components/InvoiceSummaryCard";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const invoice = invoices.find((i) => i.id === id);
    return {
        title: invoice ? `${invoice.invoiceNumber} · Tessera` : "Invoice · Tessera",
    };
}

export default async function InvoiceDetailPage({ params }: Props) {
    const { id } = await params;
    const invoice = invoices.find((i) => i.id === id);
    if (!invoice) notFound();

    const receipts = invoiceReceipts.filter((r) => r.invoiceId === id);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Finance", href: "/finance" },
                    { label: "Receivables" },
                    { label: "Invoices", href: "/finance/ar/invoices" },
                    { label: invoice.invoiceNumber },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · Receivables · Invoices"
                        title={
                            <span className="inline-flex items-center gap-3">
                                <span className="font-mono text-[28px] tracking-[0.02em]">{invoice.invoiceNumber}</span>
                                <StatusBadge status={invoice.status} />
                            </span>
                        }
                        description={`${invoice.customerName} · Issued ${format(parseISO(invoice.date), "MMM d, yyyy")}`}
                        actions={
                            <>
                                {invoice.status !== "DRAFT" && invoice.status !== "VOID" && (
                                    <Button asChild variant="outline" size="sm">
                                        <Link
                                            href={`/inventory/movements/new?type=ISSUE&sourceInvoiceId=${invoice.id}`}>
                                            <IconPackageExport stroke={1.8} />
                                            Issue items
                                        </Link>
                                    </Button>
                                )}
                                <InvoiceActionBar status={invoice.status} />
                            </>
                        }
                    />

                    <Block title="Summary" description="Customer, dates, totals, and approval state.">
                        <InvoiceSummaryCard invoice={invoice} />
                    </Block>

                    <Block
                        title="Lines"
                        description={`${invoice.lines.length} line ${invoice.lines.length === 1 ? "item" : "items"} on this invoice.`}>
                        <InvoiceLinesTable invoice={invoice} />
                    </Block>

                    <Block title="Receipts" description="Payments applied against this invoice.">
                        <InvoiceReceiptsTable receipts={receipts} currencyCode={invoice.currencyCode} />
                    </Block>
                </div>
            </div>
        </>
    );
}
