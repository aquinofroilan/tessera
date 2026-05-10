import Link from "next/link";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { formatDateShort, formatMoney } from "../_data/format";
import type { BillStatus, InvoiceStatus, IsoDate, Money } from "../_data/types";
import { OverdueCell } from "./OverdueDots";
import { StatusBadge } from "./StatusBadge";

export type DocumentQueueRow = {
    id: string;
    number: string;
    party: string;
    dueDate: IsoDate;
    daysOverdue: number;
    outstanding: Money;
    currencyCode: string;
    status: InvoiceStatus | BillStatus;
    href: string;
};

type DocumentQueueProps = {
    rows: DocumentQueueRow[];
    headers: { number: string; party: string };
};

export function DocumentQueue({ rows, headers }: DocumentQueueProps) {
    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[28%]">{headers.number}</TableHead>
                        <TableHead>{headers.party}</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead className="text-right">Outstanding</TableHead>
                        <TableHead className="w-[110px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id} className="cursor-pointer">
                            <TableCell>
                                <Link href={row.href} className="block">
                                    <span className="font-mono text-[12px] tracking-[0.04em] text-(--ink)">
                                        {row.number}
                                    </span>
                                </Link>
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">{row.party}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[13px] text-(--ink)">{formatDateShort(row.dueDate)}</span>
                                    <OverdueCell daysOverdue={row.daysOverdue} />
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {formatMoney(row.outstanding, row.currencyCode)}
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={row.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
