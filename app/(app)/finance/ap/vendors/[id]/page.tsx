import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IconPencil } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../../../_components/AppTopbar";
import { Block } from "../../../../_components/Block";
import { PageHeader } from "../../../../_components/PageHeader";
import { PartyDocumentsTable } from "../../../_components/PartyDocumentsTable";
import { PartyProfileCard } from "../../../_components/PartyProfileCard";
import { listBills } from "@/lib/api/finance/bills-dal";
import { getVendor } from "@/lib/api/finance/vendors-dal";
import { formatMoney } from "../../../_data/format";
import { subtractMoney, sumMoney } from "../../../_data/money";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const vendor = await getVendor(id);
    return { title: vendor ? `${vendor.name} · Loom` : "Vendor · Loom" };
};

const VendorDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const vendor = await getVendor(id);
    if (!vendor) notFound();

    const vendorBills = await listBills({ vendorId: id });
    const outstanding = subtractMoney(
        sumMoney(vendorBills.map((b) => b.totalAmount)),
        sumMoney(vendorBills.map((b) => b.amountPaid)),
    );

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Finance", href: "/finance" },
                    { label: "Payables" },
                    { label: "Vendors", href: "/finance/ap/vendors" },
                    { label: vendor.name },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · Payables · Vendors"
                        title={vendor.name}
                        description={
                            vendorBills.length === 0
                                ? "No bills yet."
                                : `${vendorBills.length} bill${vendorBills.length === 1 ? "" : "s"} · ${formatMoney(outstanding, "USD")} outstanding`
                        }
                        actions={
                            <Button variant="outline" size="sm">
                                <IconPencil stroke={1.8} />
                                Edit
                            </Button>
                        }
                    />

                    <Block title="Profile" description="Contact, payment terms, and default expense routing.">
                        <PartyProfileCard
                            profile={{
                                contactName: vendor.contactName,
                                contactEmail: vendor.contactEmail,
                                contactPhone: vendor.contactPhone,
                                paymentTermDays: vendor.paymentTermDays,
                                defaultAccountLabel: "Default expense account",
                                defaultAccountValue: vendor.defaultExpenseAccountId,
                                isActive: vendor.isActive,
                            }}
                        />
                    </Block>

                    <Block title="Bills" description={`Recent bills from ${vendor.name}.`}>
                        <PartyDocumentsTable
                            rows={vendorBills.map((b) => ({
                                id: b.id,
                                number: b.billNumber,
                                date: b.date,
                                dueDate: b.dueDate,
                                totalAmount: b.totalAmount,
                                currencyCode: b.currencyCode,
                                status: b.status,
                            }))}
                            detailHrefBase="/finance/ap/bills"
                            numberHeader="Bill #"
                            emptyHeading="No bills yet."
                            emptyDescription="Record one when this vendor sends an invoice."
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default VendorDetailPage;
