import Link from "next/link";
import { IconFileOff } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { InvoiceResponse } from "@/lib/api/finance/invoices";
import { OverdueCell } from "../../../_components/OverdueDots";
import { StatusBadge } from "../../../_components/StatusBadge";
import { daysUntilDue, formatDateShort, formatMoney } from "../../../_data/format";
import { InvoiceRowMenu } from "./InvoiceRowMenu";

function outstandingOf(inv: InvoiceResponse) {
    return (Number(inv.totalAmount) - Number(inv.amountReceived)).toFixed(2);
}

export function InvoicesTable({ rows, asOfDate }: { rows: InvoiceResponse[]; asOfDate: string }) {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconFileOff className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">
                    No invoices match your filters.
                </div>
                <div className="max-w-80 text-sm text-(--muted)">
                    Try clearing the search or selecting a different status.
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Invoice</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="w-[80px]">Date</TableHead>
                        <TableHead className="w-[120px]">Due</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Outstanding</TableHead>
                        <TableHead className="w-[110px]">Status</TableHead>
                        <TableHead className="w-[40px]" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((inv) => {
                        const outstanding = outstandingOf(inv);
                        return (
                            <TableRow key={inv.id}>
                                <TableCell>
                                    <Link
                                        href={`/finance/ar/invoices/${inv.id}`}
                                        className="font-mono text-[12px] tracking-[0.04em] text-(--ink) hover:text-(--accent)">
                                        {inv.invoiceNumber}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-(--ink-soft)">
                                    <span className="block text-(--ink)">{inv.customerName}</span>
                                    {inv.referenceNumber && (
                                        <span className="block font-mono text-[11px] text-(--muted)">
                                            {inv.referenceNumber}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-[13px] text-(--ink-soft)">
                                    {formatDateShort(inv.date)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[13px] text-(--ink)">{formatDateShort(inv.dueDate)}</span>
                                        <OverdueCell daysOverdue={daysUntilDue(inv.dueDate, asOfDate)} />
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(inv.totalAmount, inv.currencyCode)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatMoney(outstanding, inv.currencyCode)}
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={inv.status} />
                                </TableCell>
                                <TableCell>
                                    <InvoiceRowMenu id={inv.id} invoiceNumber={inv.invoiceNumber} status={inv.status} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Card>
    );
}
