import Link from "next/link";
import { IconClock } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { TimeEntryResponse } from "@/lib/api/projects/time-entries";
import { TableEmptyState } from "../../hr/_components/TableEmptyState";
import { TimeEntryStatusBadge } from "./TimeEntryStatusBadge";
import { TimeEntryRowActions } from "./TimeEntryRowActions";

type EmployeeInfo = { employeeNumber: string; firstName: string; lastName: string };
type ProjectInfo = { projectNumber: string; name: string };

type Props = {
    rows: TimeEntryResponse[];
    employeeById: Record<string, EmployeeInfo>;
    projectById: Record<string, ProjectInfo>;
    showActions?: boolean;
};

const fmtAmount = (hours: string, rate: string | null): string => {
    if (!rate) return "—";
    const value = Number(hours) * Number(rate);
    if (!Number.isFinite(value)) return "—";
    return value.toFixed(2);
};

export const TimeEntriesTable = ({
    rows,
    employeeById,
    projectById,
    showActions = true,
}: Props) => {
    if (!rows.length) {
        return (
            <TableEmptyState
                icon={IconClock}
                title="No time entries."
                hint="Log time against a project to start building the timesheet."
            />
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[110px]">Date</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead className="w-[80px] text-right">Hours</TableHead>
                        <TableHead className="w-[100px] text-right">Rate</TableHead>
                        <TableHead className="w-[100px] text-right">Amount</TableHead>
                        <TableHead className="w-[110px]">Billable</TableHead>
                        <TableHead className="w-[110px]">Status</TableHead>
                        {showActions && <TableHead className="w-[200px] text-right">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => {
                        const emp = employeeById[row.employeeId];
                        const proj = projectById[row.projectId];
                        return (
                            <TableRow key={row.id}>
                                <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                    {row.entryDate}
                                </TableCell>
                                <TableCell className="text-(--ink-soft)">
                                    {emp ? `${emp.employeeNumber} · ${emp.firstName} ${emp.lastName}` : "—"}
                                </TableCell>
                                <TableCell>
                                    {proj ? (
                                        <Link
                                            href={`/projects/${row.projectId}`}
                                            className="text-(--ink) hover:text-(--accent)">
                                            {proj.projectNumber} · {proj.name}
                                        </Link>
                                    ) : (
                                        "—"
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-mono text-[12px] tabular-nums">
                                    {row.hours}
                                </TableCell>
                                <TableCell className="text-right font-mono text-[12px] tabular-nums text-(--ink-soft)">
                                    {row.rate ?? "—"}
                                </TableCell>
                                <TableCell className="text-right font-mono text-[12px] tabular-nums">
                                    {fmtAmount(row.hours, row.rate)}
                                </TableCell>
                                <TableCell className="text-(--ink-soft)">
                                    {row.billable ? "Billable" : "Internal"}
                                </TableCell>
                                <TableCell>
                                    <TimeEntryStatusBadge status={row.status} />
                                </TableCell>
                                {showActions && (
                                    <TableCell className="text-right">
                                        <TimeEntryRowActions
                                            id={row.id}
                                            status={row.status}
                                        />
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Card>
    );
};
