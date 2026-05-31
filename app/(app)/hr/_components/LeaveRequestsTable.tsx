import Link from "next/link";
import { IconCalendarOff } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { LeaveRequestResponse } from "@/lib/api/hr/leave-requests";
import { LeaveRequestStatusBadge } from "./LeaveRequestStatusBadge";

type Props = {
    rows: LeaveRequestResponse[];
    employeeNameById: Record<string, string>;
    leaveTypeNameById: Record<string, string>;
    detailHrefBase: string;
};

export const LeaveRequestsTable = ({
    rows,
    employeeNameById,
    leaveTypeNameById,
    detailHrefBase,
}: Props) => {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconCalendarOff className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">
                    No leave requests.
                </div>
                <div className="max-w-80 text-sm text-(--muted)">
                    File one when someone needs time away from work.
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="w-[110px]">Start</TableHead>
                        <TableHead className="w-[110px]">End</TableHead>
                        <TableHead className="w-[70px] text-right">Days</TableHead>
                        <TableHead className="w-[110px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <Link
                                    href={`${detailHrefBase}/${row.id}`}
                                    className="font-medium text-(--ink) hover:text-(--accent)">
                                    {employeeNameById[row.employeeId] ?? row.employeeId}
                                </Link>
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">
                                {leaveTypeNameById[row.leaveTypeId] ?? row.leaveTypeId}
                            </TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.startDate}
                            </TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.endDate}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.days}
                            </TableCell>
                            <TableCell>
                                <LeaveRequestStatusBadge status={row.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
