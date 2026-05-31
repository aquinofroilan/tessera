import Link from "next/link";
import { IconBriefcase2 } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { PositionResponse } from "@/lib/api/hr/positions";
import { TableEmptyState } from "./TableEmptyState";

type Props = {
    rows: PositionResponse[];
    departmentNameById: Record<string, string>;
    detailHrefBase: string;
};

export const PositionsTable = ({ rows, departmentNameById, detailHrefBase }: Props) => {
    if (!rows.length) {
        return (
            <TableEmptyState
                icon={IconBriefcase2}
                title="No positions yet."
                hint="Define positions before linking compensation records to them."
            />
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[140px]">Code</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="w-[120px]">Pay grade</TableHead>
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
                                    {row.title}
                                </Link>
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">
                                {row.departmentId ? (departmentNameById[row.departmentId] ?? "—") : "—"}
                            </TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                {row.payGrade ?? "—"}
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
