import Link from "next/link";
import { IconClock } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { AttendanceResponse } from "@/lib/api/hr/attendance";
import { AttendanceStatusBadge } from "../../_components/AttendanceStatusBadge";
import { TableEmptyState } from "../../_components/TableEmptyState";

type Props = {
    rows: AttendanceResponse[];
    employeeNameById: Record<string, string>;
    detailHrefBase: string;
};

const formatTime = (value: string | null): string => {
    if (!value) return "—";
    return value.slice(11, 16);
};

const formatHours = (minutes: number | null): string => {
    if (minutes == null) return "—";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

export const AttendanceTable = ({ rows, employeeNameById, detailHrefBase }: Props) => {
    if (!rows.length) {
        return (
            <TableEmptyState
                icon={IconClock}
                title="No attendance records."
                hint="Records show up here once someone is clocked in or a record is entered manually."
            />
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead className="w-[110px]">Date</TableHead>
                        <TableHead className="w-[90px]">In</TableHead>
                        <TableHead className="w-[90px]">Out</TableHead>
                        <TableHead className="w-[90px] text-right">Worked</TableHead>
                        <TableHead className="w-[110px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <Link
                                    href={`${detailHrefBase}/${row.id}`}
                                    className="text-foreground hover:text-(--accent) no-underline">
                                    {employeeNameById[row.employeeId] ?? row.employeeId}
                                </Link>
                            </TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.workDate}
                            </TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {formatTime(row.clockIn)}
                            </TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {formatTime(row.clockOut)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[13px] text-(--ink) tabular-nums">
                                {formatHours(row.workedMinutes)}
                            </TableCell>
                            <TableCell>
                                <AttendanceStatusBadge status={row.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
