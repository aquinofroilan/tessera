import { IconReceiptOff } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { BillPaymentResponse } from "@/lib/api/finance/bills";
import { formatDateShort, formatMoney } from "../../../../_data/format";

const methodLabels: Record<BillPaymentResponse["paymentMethod"], string> = {
    CASH: "Cash",
    CHECK: "Check",
    BANK_TRANSFER: "Bank transfer",
    CREDIT_CARD: "Credit card",
    OTHER: "Other",
};

export function BillPaymentsTable({
    payments,
    currencyCode,
}: {
    payments: BillPaymentResponse[];
    currencyCode: string;
}) {
    if (!payments.length) {
        return (
            <Card className="items-center gap-2 px-6 py-10 text-center">
                <span className="grid size-9 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconReceiptOff className="size-4.5" stroke={1.6} />
                </span>
                <div className="text-sm font-medium text-(--ink)">No payments yet.</div>
                <div className="max-w-72 text-[13px] text-(--muted)">
                    Record a payment when funds clear to move this bill toward Paid.
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell className="text-[13px] text-(--ink-soft)">
                                {formatDateShort(p.paymentDate)}
                            </TableCell>
                            <TableCell className="text-(--ink)">{methodLabels[p.paymentMethod]}</TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                {p.referenceNumber ?? "—"}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {formatMoney(p.amount, currencyCode)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
