import Link from "next/link";
import { IconBuildingWarehouse } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { WarehouseResponse } from "@/lib/api/inventory/warehouses";

type WarehousesTableProps = {
    rows: WarehouseResponse[];
    detailHrefBase: string;
};

export const WarehousesTable = ({ rows, detailHrefBase }: WarehousesTableProps) => {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconBuildingWarehouse className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">
                    No warehouses yet.
                </div>
                <div className="max-w-80 text-sm text-(--muted)">
                    Add a warehouse before recording any stock movement.
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead className="w-[120px] text-right">Locations</TableHead>
                        <TableHead className="w-[140px]">Negative stock</TableHead>
                        <TableHead className="w-[90px]">Default</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                {row.code}
                            </TableCell>
                            <TableCell>
                                <Link
                                    href={`${detailHrefBase}/${row.id}`}
                                    className="font-medium text-(--ink) hover:text-(--accent)">
                                    {row.name}
                                </Link>
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">{row.address ?? "—"}</TableCell>
                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.storageLocationCount}
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">
                                {row.allowNegativeStock ? "Allowed" : "Blocked"}
                            </TableCell>
                            <TableCell>
                                {row.isDefault ? (
                                    <span className="inline-flex items-center rounded-full bg-(--accent)/15 px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--accent) uppercase">
                                        Default
                                    </span>
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
