import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IconPencil } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../../../_components/AppTopbar";
import { Block } from "../../../../_components/Block";
import { PageHeader } from "../../../../_components/PageHeader";
import { PartyDocumentsTable } from "../../../_components/PartyDocumentsTable";
import { PartyProfileCard } from "../../../_components/PartyProfileCard";
import { formatMoney } from "../../../_data/format";
import { invoices } from "../../invoices/_data/invoices-mock";
import { customers } from "../_data/customers-mock";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const customer = customers.find((c) => c.id === id);
    return { title: customer ? `${customer.name} · Loom` : "Customer · Loom" };
}

export default async function CustomerDetailPage({ params }: Props) {
    const { id } = await params;
    const customer = customers.find((c) => c.id === id);
    if (!customer) notFound();

    const customerInvoices = invoices.filter((inv) => inv.customerId === id);
    const totalBilled = customerInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
    const totalReceived = customerInvoices.reduce((sum, inv) => sum + Number(inv.amountReceived), 0);
    const outstanding = (totalBilled - totalReceived).toFixed(2);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Finance", href: "/finance" },
                    { label: "Receivables" },
                    { label: "Customers", href: "/finance/ar/customers" },
                    { label: customer.name },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · Receivables · Customers"
                        title={customer.name}
                        description={
                            customerInvoices.length === 0
                                ? "No invoices yet."
                                : `${customerInvoices.length} invoice${customerInvoices.length === 1 ? "" : "s"} · ${formatMoney(outstanding, "USD")} outstanding`
                        }
                        actions={
                            <Button variant="outline" size="sm">
                                <IconPencil stroke={1.8} />
                                Edit
                            </Button>
                        }
                    />

                    <Block title="Profile" description="Contact, payment terms, and default revenue routing.">
                        <PartyProfileCard
                            profile={{
                                contactName: customer.contactName,
                                contactEmail: customer.contactEmail,
                                contactPhone: customer.contactPhone,
                                paymentTermDays: customer.paymentTermDays,
                                defaultAccountLabel: "Default revenue account",
                                defaultAccountValue: customer.defaultRevenueAccountId,
                                isActive: customer.isActive,
                            }}
                        />
                    </Block>

                    <Block title="Invoices" description={`Recent invoices billed to ${customer.name}.`}>
                        <PartyDocumentsTable
                            rows={customerInvoices.map((inv) => ({
                                id: inv.id,
                                number: inv.invoiceNumber,
                                date: inv.date,
                                dueDate: inv.dueDate,
                                totalAmount: inv.totalAmount,
                                currencyCode: inv.currencyCode,
                                status: inv.status,
                            }))}
                            detailHrefBase="/finance/ar/invoices"
                            numberHeader="Invoice"
                            emptyHeading="No invoices yet."
                            emptyDescription="Create one to start billing this customer."
                        />
                    </Block>
                </div>
            </div>
        </>
    );
}
