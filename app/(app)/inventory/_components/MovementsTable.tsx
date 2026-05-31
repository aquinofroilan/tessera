import Link from "next/link";
import { IconArrowsTransferDown } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { MovementSummaryResponse } from "@/lib/api/inventory/movements";
import { formatMoney } from "../../finance/_data/format";
import { MovementTypeBadge } from "./MovementTypeBadge";

type MovementsTableProps = {
    rows: MovementSummaryResponse[];
    detailHrefBase: string;
    currency?: string;
};

export const MovementsTable = ({ rows, detailHrefBase, currency = "USD" }: MovementsTableProps) => {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconArrowsTransferDown className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">
                    No movements yet.
                </div>
                <div className="max-w-80 text-sm text-(--muted)">
                    Record a receipt, issue, transfer, or adjustment to start the ledger.
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[110px]">Date</TableHead>
                        <TableHead className="w-[140px]">Type</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="w-[100px] text-right">Items</TableHead>
                        <TableHead className="w-[160px] text-right">Total value</TableHead>
                        <TableHead className="w-[110px]">Journal</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                {row.date}
                            </TableCell>
                            <TableCell>
                                <MovementTypeBadge type={row.type} />
                            </TableCell>
                            <TableCell>
                                <Link
                                    href={`${detailHrefBase}/${row.id}`}
                                    className="font-medium text-(--ink) hover:text-(--accent)">
                                    {row.referenceNumber ?? row.id.slice(0, 8)}
                                </Link>
                            </TableCell>
                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.itemCount}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {formatMoney(row.totalValue, currency)}
                            </TableCell>
                            <TableCell>
                                {row.journalEntryId ? (
                                    <Link
                                        href={`/finance/journal/${row.journalEntryId}`}
                                        className="font-mono text-[11px] tracking-[0.02em] text-(--accent) hover:underline">
                                        Open →
                                    </Link>
                                ) : (
                                    <span className="text-(--muted)">—</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
