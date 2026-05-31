import Link from "next/link";
import { IconBeach } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { LeaveTypeResponse } from "@/lib/api/hr/leave-types";
import { TableEmptyState } from "./TableEmptyState";

type Props = {
    rows: LeaveTypeResponse[];
    detailHrefBase: string;
};

export const LeaveTypesTable = ({ rows, detailHrefBase }: Props) => {
    if (!rows.length) {
        return (
            <TableEmptyState
                icon={IconBeach}
                title="No leave types yet."
                hint="Add a leave type before anyone can file a request."
            />
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
