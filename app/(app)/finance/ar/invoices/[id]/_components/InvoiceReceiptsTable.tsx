import type { InvoiceReceiptResponse } from "@/lib/api/finance/invoices";
import { TransactionsTable } from "../../../../_components/TransactionsTable";

export function InvoiceReceiptsTable({
    receipts,
    currencyCode,
}: {
    receipts: InvoiceReceiptResponse[];
    currencyCode: string;
}) {
    return (
        <TransactionsTable
            rows={receipts.map((r) => ({
                id: r.id,
                date: r.receiptDate,
                paymentMethod: r.paymentMethod,
                referenceNumber: r.referenceNumber,
                amount: r.amount,
            }))}
            currencyCode={currencyCode}
            emptyHeading="No receipts yet."
            emptyDescription="Record a receipt when payment lands to move this invoice toward Paid."
        />
    );
}
