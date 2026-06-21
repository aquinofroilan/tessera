import Link from "next/link";
import { IconClipboardList } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { PurchaseRequestResponse } from "@/lib/api/procurement/purchase-requests";
import { PurchaseRequestStatusBadge } from "../../_components/PurchaseRequestStatusBadge";

type Props = {
    rows: PurchaseRequestResponse[];
    detailHrefBase: string;
};

export const PurchaseRequestsTable = ({ rows, detailHrefBase }: Props) => {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconClipboardList className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380]">No purchase requests yet.</div>
                <div className="max-w-80 text-sm text-(--muted)">
                    Start one when someone needs to buy something that needs approval first.
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[140px]">PR #</TableHead>
                        <TableHead>Justification</TableHead>
                        <TableHead className="w-[80px] text-right">Lines</TableHead>
                        <TableHead className="w-[120px]">Created</TableHead>
                        <TableHead className="w-[160px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <Link
                                    href={`${detailHrefBase}/${row.id}`}
                                    className="font-mono text-[12px] tracking-[0.04em] text-foreground uppercase no-underline hover:text-(--accent)">
                                    {row.prNumber}
                                </Link>
                            </TableCell>
                            <TableCell className="text-[13px] text-(--ink-soft)">
                                {row.justification ?? "—"}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[12px] tabular-nums">
                                {row.lines.length}
                            </TableCell>
                            <TableCell className="font-mono text-[11px] tracking-[0.02em] text-(--muted) tabular-nums">
                                {row.createdAt?.slice(0, 10) ?? "—"}
                            </TableCell>
                            <TableCell>
                                <PurchaseRequestStatusBadge status={row.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
