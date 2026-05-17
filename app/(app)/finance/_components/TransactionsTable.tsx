import { IconReceiptOff } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { Money } from "@/lib/api/types";
import { formatDateShort, formatMoney } from "../_data/format";

const methodLabels = {
    CASH: "Cash",
    CHECK: "Check",
    BANK_TRANSFER: "Bank transfer",
    CREDIT_CARD: "Credit card",
    OTHER: "Other",
} as const;

export type TransactionRow = {
    id: string;
    date: string;
    paymentMethod: keyof typeof methodLabels;
    referenceNumber: string | null;
    amount: Money;
};

type TransactionsTableProps = {
    rows: TransactionRow[];
    currencyCode: string;
    emptyHeading: string;
    emptyDescription: string;
};

export function TransactionsTable({ rows, currencyCode, emptyHeading, emptyDescription }: TransactionsTableProps) {
    if (!rows.length) {
        return (
            <Card className="items-center gap-2 px-6 py-10 text-center">
                <span className="grid size-9 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconReceiptOff className="size-4.5" stroke={1.6} />
                </span>
                <div className="text-sm font-medium text-(--ink)">{emptyHeading}</div>
                <div className="max-w-72 text-[13px] text-(--muted)">{emptyDescription}</div>
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
                    {rows.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell className="text-[13px] text-(--ink-soft)">{formatDateShort(r.date)}</TableCell>
                            <TableCell className="text-(--ink)">{methodLabels[r.paymentMethod]}</TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                {r.referenceNumber ?? "—"}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {formatMoney(r.amount, currencyCode)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
