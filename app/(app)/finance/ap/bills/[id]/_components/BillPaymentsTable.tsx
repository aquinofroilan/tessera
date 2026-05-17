import type { BillPaymentResponse } from "@/lib/api/finance/bills";
import { TransactionsTable } from "../../../../_components/TransactionsTable";

export function BillPaymentsTable({
    payments,
    currencyCode,
}: {
    payments: BillPaymentResponse[];
    currencyCode: string;
}) {
    return (
        <TransactionsTable
            rows={payments.map((p) => ({
                id: p.id,
                date: p.paymentDate,
                paymentMethod: p.paymentMethod,
                referenceNumber: p.referenceNumber,
                amount: p.amount,
            }))}
            currencyCode={currencyCode}
            emptyHeading="No payments yet."
            emptyDescription="Record a payment when funds clear to move this bill toward Paid."
        />
    );
}
