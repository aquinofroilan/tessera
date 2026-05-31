import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { IconPackageImport } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../../../_components/AppTopbar";
import { Block } from "../../../../_components/Block";
import { PageHeader } from "../../../../_components/PageHeader";
import { StatusBadge } from "../../../_components/StatusBadge";
import { getBill, getBillPayments } from "@/lib/api/finance/bills-dal";
import { BillActionBar } from "./_components/BillActionBar";
import { BillLinesTable } from "./_components/BillLinesTable";
import { BillPaymentsTable } from "./_components/BillPaymentsTable";
import { BillSummaryCard } from "./_components/BillSummaryCard";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const bill = await getBill(id);
    return {
        title: bill ? `${bill.billNumber} · Loom` : "Bill · Loom",
    };
};

const BillDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const bill = await getBill(id);
    if (!bill) notFound();

    const payments = await getBillPayments(id);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Finance", href: "/finance" },
                    { label: "Payables" },
                    { label: "Bills", href: "/finance/ap/bills" },
                    { label: bill.billNumber },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · Payables · Bills"
                        title={
                            <span className="inline-flex items-center gap-3">
                                <span className="font-mono text-[28px] tracking-[0.02em]">{bill.billNumber}</span>
                                <StatusBadge status={bill.status} />
                            </span>
                        }
                        description={`${bill.vendorName} · Issued ${format(parseISO(bill.date), "MMM d, yyyy")}`}
                        actions={
                            <>
                                {bill.status !== "DRAFT" && bill.status !== "VOID" && (
                                    <Button asChild variant="outline" size="sm">
                                        <Link
                                            href={`/inventory/movements/new?type=RECEIPT&sourceBillId=${bill.id}`}>
                                            <IconPackageImport stroke={1.8} />
                                            Receive items
                                        </Link>
                                    </Button>
                                )}
                                <BillActionBar status={bill.status} />
                            </>
                        }
                    />

                    <Block title="Summary" description="Vendor, dates, totals, and approval state.">
                        <BillSummaryCard bill={bill} />
                    </Block>

                    <Block
                        title="Lines"
                        description={`${bill.lines.length} line ${bill.lines.length === 1 ? "item" : "items"} on this bill.`}>
                        <BillLinesTable bill={bill} />
                    </Block>

                    <Block title="Payments" description="Disbursements applied against this bill.">
                        <BillPaymentsTable payments={payments} currencyCode={bill.currencyCode} />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default BillDetailPage;
