import type { InvoiceResponse } from "@/lib/api/finance/invoices";
import { DocumentSummaryCard } from "../../../../_components/DocumentSummaryCard";

export function InvoiceSummaryCard({ invoice }: { invoice: InvoiceResponse }) {
    const outstanding = (Number(invoice.totalAmount) - Number(invoice.amountReceived)).toFixed(2);
    return (
        <DocumentSummaryCard
            summary={{
                partyLabel: "Customer",
                partyName: invoice.customerName,
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
