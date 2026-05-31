import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IconPencil } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../../../_components/AppTopbar";
import { Block } from "../../../../_components/Block";
import { PageHeader } from "../../../../_components/PageHeader";
import { PartyDocumentsTable } from "../../../_components/PartyDocumentsTable";
import { PartyProfileCard } from "../../../_components/PartyProfileCard";
import { listInvoices } from "@/lib/api/finance/invoices-dal";
import { getCustomer } from "@/lib/api/finance/customers-dal";
import { formatMoney } from "../../../_data/format";
import { subtractMoney, sumMoney } from "../../../_data/money";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const customer = await getCustomer(id);
    return { title: customer ? `${customer.name} · Tessera` : "Customer · Tessera" };
};

const CustomerDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const customer = await getCustomer(id);
    if (!customer) notFound();

    const customerInvoices = await listInvoices({ customerId: id });
    const outstanding = subtractMoney(
        sumMoney(customerInvoices.map((inv) => inv.totalAmount)),
        sumMoney(customerInvoices.map((inv) => inv.amountReceived)),
    );

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
};

export default CustomerDetailPage;
