import Link from "next/link";
import { IconPackageOff } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { ItemSummaryResponse } from "@/lib/api/inventory/items";
import { formatMoney } from "../../finance/_data/format";
import { formatQuantity, itemKindLabel } from "../_data/format";
import { InventoryStatusBadge } from "./InventoryStatusBadge";

type ItemsTableProps = {
    rows: ItemSummaryResponse[];
    detailHrefBase: string;
};

export const ItemsTable = ({ rows, detailHrefBase }: ItemsTableProps) => {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconPackageOff className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">
                    No items match your filters.
                </div>
                <div className="max-w-80 text-sm text-(--muted)">
                    Try clearing the search or switching scope. Add a new item to get started.
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[140px]">SKU</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-[100px]">Kind</TableHead>
                        <TableHead className="w-[120px] text-right">On hand</TableHead>
                        <TableHead className="w-[140px] text-right">Value</TableHead>
                        <TableHead className="w-[90px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                {row.sku}
                            </TableCell>
                            <TableCell>
                                <Link
                                    href={`${detailHrefBase}/${row.id}`}
                                    className="font-medium text-(--ink) hover:text-(--accent)">
                                    {row.name}
                                </Link>
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">{itemKindLabel(row.kind)}</TableCell>
                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {formatQuantity(row.onHand, row.unitOfMeasure)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {formatMoney(row.onHandValue, row.currencyCode ?? "USD")}
                            </TableCell>
                            <TableCell>
                                <InventoryStatusBadge status={row.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
