import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { StorageLocationResponse } from "@/lib/api/inventory/storage-locations";

type StorageLocationsTableProps = {
    rows: StorageLocationResponse[];
};

export const StorageLocationsTable = ({ rows }: StorageLocationsTableProps) => {
    if (!rows.length) {
        return (
            <Card className="items-center gap-2 px-6 py-8 text-center">
                <div className="text-sm text-(--muted)">
                    No storage locations yet. Add a bin or zone below to organize stock within this warehouse.
                </div>
            </Card>
        );
    }

    const byId = new Map(rows.map((r) => [r.id, r]));

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Parent</TableHead>
                        <TableHead className="w-[90px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => {
                        const parent = row.parentLocationId ? byId.get(row.parentLocationId) : null;
                        return (
                            <TableRow key={row.id}>
                                <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                    {row.code}
                                </TableCell>
                                <TableCell className="font-medium text-(--ink)">{row.name}</TableCell>
                                <TableCell className="text-(--ink-soft)">
                                    {parent ? `${parent.code} — ${parent.name}` : "—"}
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={
                                            row.isActive
                                                ? "inline-flex items-center rounded-full bg-(--moss-soft) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--moss) uppercase"
                                                : "inline-flex items-center rounded-full bg-(--paper-3) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--muted) uppercase"
                                        }>
                                        {row.isActive ? "Active" : "Archived"}
                                    </span>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Card>
    );
};
