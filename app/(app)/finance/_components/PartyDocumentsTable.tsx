import Link from "next/link";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { Money } from "@/lib/api/types";
import { StatusBadge } from "./StatusBadge";
import { formatDateShort, formatMoney } from "../_data/format";

export type PartyDocumentRow = {
    id: string;
    number: string;
    date: string;
    dueDate: string;
    totalAmount: Money;
    currencyCode: string;
    status: "DRAFT" | "APPROVED" | "PARTIALLY_PAID" | "PAID" | "VOID";
};

type PartyDocumentsTableProps = {
    rows: PartyDocumentRow[];
    detailHrefBase: string;
    numberHeader: string;
    emptyHeading: string;
    emptyDescription: string;
};

export function PartyDocumentsTable({
    rows,
    detailHrefBase,
    numberHeader,
    emptyHeading,
    emptyDescription,
}: PartyDocumentsTableProps) {
    if (!rows.length) {
        return (
            <Card className="items-center px-6 py-10 text-center">
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
                        <TableHead className="w-[140px]">{numberHeader}</TableHead>
                        <TableHead className="w-[80px]">Date</TableHead>
                        <TableHead className="w-[80px]">Due</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[110px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <Link
                                    href={`${detailHrefBase}/${row.id}`}
                                    className="font-mono text-[12px] tracking-[0.04em] text-(--ink) hover:text-(--accent)">
                                    {row.number}
                                </Link>
                            </TableCell>
                            <TableCell className="text-[13px] text-(--ink-soft)">{formatDateShort(row.date)}</TableCell>
                            <TableCell className="text-[13px] text-(--ink-soft)">
                                {formatDateShort(row.dueDate)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {formatMoney(row.totalAmount, row.currencyCode)}
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
