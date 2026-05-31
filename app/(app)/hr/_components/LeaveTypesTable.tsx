import Link from "next/link";
import { IconBeach } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { LeaveTypeResponse } from "@/lib/api/hr/leave-types";

type Props = {
    rows: LeaveTypeResponse[];
    detailHrefBase: string;
};

export const LeaveTypesTable = ({ rows, detailHrefBase }: Props) => {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconBeach className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">
                    No leave types yet.
                </div>
                <div className="max-w-80 text-sm text-(--muted)">
                    Add a leave type before anyone can file a request.
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[140px]">Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-[120px]">Paid</TableHead>
                        <TableHead className="w-[160px] text-right">Default annual days</TableHead>
                        <TableHead className="w-[110px]">Status</TableHead>
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
                            <TableCell className="text-(--ink-soft)">{row.paid ? "Yes" : "No"}</TableCell>
                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.defaultAnnualDays}
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">
                                {row.isActive ? "Active" : "Archived"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
