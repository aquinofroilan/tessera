import Link from "next/link";
import { IconUsers } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { EmployeeResponse } from "@/lib/api/hr/employees";
import { EmployeeStatusBadge } from "./EmployeeStatusBadge";

type Props = {
    rows: EmployeeResponse[];
    departmentNameById: Record<string, string>;
    detailHrefBase: string;
};

export const EmployeesTable = ({ rows, departmentNameById, detailHrefBase }: Props) => {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconUsers className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">
                    No employees yet.
                </div>
                <div className="max-w-80 text-sm text-(--muted)">
                    Hire someone to get the roster started.
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Number</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Job title</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="w-[120px]">Hired</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                {row.employeeNumber}
                            </TableCell>
                            <TableCell>
                                <Link
                                    href={`${detailHrefBase}/${row.id}`}
                                    className="font-medium text-(--ink) hover:text-(--accent)">
                                    {row.firstName} {row.lastName}
                                </Link>
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">{row.jobTitle ?? "—"}</TableCell>
                            <TableCell className="text-(--ink-soft)">
                                {row.departmentId ? (departmentNameById[row.departmentId] ?? "—") : "—"}
                            </TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.hireDate}
                            </TableCell>
                            <TableCell>
                                <EmployeeStatusBadge status={row.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
