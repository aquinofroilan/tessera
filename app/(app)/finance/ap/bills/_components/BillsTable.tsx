import Link from "next/link";
import { IconFileOff } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { BillResponse } from "@/lib/api/finance/bills";
import { OverdueCell } from "../../../_components/OverdueDots";
import { StatusBadge } from "../../../_components/StatusBadge";
import { daysUntilDue, formatDateShort, formatMoney } from "../../../_data/format";
import { BillRowMenu } from "./BillRowMenu";

function outstandingOf(bill: BillResponse) {
    return (Number(bill.totalAmount) - Number(bill.amountPaid)).toFixed(2);
}

export function BillsTable({ rows, asOfDate }: { rows: BillResponse[]; asOfDate: string }) {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconFileOff className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">
                    No bills match your filters.
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
                        <TableHead className="w-[140px]">Bill #</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead className="w-[80px]">Date</TableHead>
                        <TableHead className="w-[120px]">Due</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Outstanding</TableHead>
                        <TableHead className="w-[110px]">Status</TableHead>
                        <TableHead className="w-[40px]" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((bill) => {
                        const outstanding = outstandingOf(bill);
                        return (
                            <TableRow key={bill.id}>
                                <TableCell>
                                    <Link
                                        href={`/finance/ap/bills/${bill.id}`}
                                        className="font-mono text-[12px] tracking-[0.04em] text-(--ink) hover:text-(--accent)">
                                        {bill.billNumber}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-(--ink-soft)">
                                    <span className="block text-(--ink)">{bill.vendorName}</span>
                                    {bill.referenceNumber && (
                                        <span className="block font-mono text-[11px] text-(--muted)">
                                            {bill.referenceNumber}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-[13px] text-(--ink-soft)">
                                    {formatDateShort(bill.date)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[13px] text-(--ink)">{formatDateShort(bill.dueDate)}</span>
                                        <OverdueCell daysOverdue={daysUntilDue(bill.dueDate, asOfDate)} />
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatMoney(bill.totalAmount, bill.currencyCode)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatMoney(outstanding, bill.currencyCode)}
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={bill.status} />
                                </TableCell>
                                <TableCell>
                                    <BillRowMenu id={bill.id} billNumber={bill.billNumber} status={bill.status} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Card>
    );
}
