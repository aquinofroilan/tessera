import Link from "next/link";
import { IconUsers } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { EmployeeResponse } from "@/lib/api/hr/employees";
import { EmployeeStatusBadge } from "./EmployeeStatusBadge";
import { TableEmptyState } from "./TableEmptyState";

type Props = {
    rows: EmployeeResponse[];
    departmentNameById: Record<string, string>;
    detailHrefBase: string;
};

export const EmployeesTable = ({ rows, departmentNameById, detailHrefBase }: Props) => {
    if (!rows.length) {
        return (
            <TableEmptyState
                icon={IconUsers}
                title="No employees yet."
                hint="Hire someone to get the roster started."
            />
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
