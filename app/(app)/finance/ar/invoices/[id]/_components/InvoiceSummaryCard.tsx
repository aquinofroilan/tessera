import type { InvoiceResponse } from "@/lib/api/finance/invoices";
import { DocumentSummaryCard } from "../../../../_components/DocumentSummaryCard";
import { calculateOutstanding } from "../../../../_data/format";

export function InvoiceSummaryCard({ invoice }: { invoice: InvoiceResponse }) {
    const outstanding = calculateOutstanding(invoice.totalAmount, invoice.amountReceived);
    return (
        <DocumentSummaryCard
            summary={{
                partyLabel: "Customer",
                partyName: invoice.customerName,
                partyHref: `/finance/ar/customers/${invoice.customerId}`,
                referenceNumber: invoice.referenceNumber,
                date: invoice.date,
                dueDate: invoice.dueDate,
                totalAmount: invoice.totalAmount,
                taxAmount: invoice.taxAmount,
                settledLabel: "Received",
                settledAmount: invoice.amountReceived,
                outstanding,
                currencyCode: invoice.currencyCode,
                createdBy: invoice.createdBy,
                approvedAt: invoice.approvedAt,
                approvedBy: invoice.approvedBy,
                settledOn: { label: "Paid", value: invoice.paidAt },
                voidedAt: invoice.voidedAt,
                voidedBy: invoice.voidedBy,
                voidReason: invoice.voidReason,
            }}
        />
    );
}
