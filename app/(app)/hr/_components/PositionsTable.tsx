import Link from "next/link";
import { IconBriefcase2 } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { PositionResponse } from "@/lib/api/hr/positions";

type Props = {
    rows: PositionResponse[];
    departmentNameById: Record<string, string>;
    detailHrefBase: string;
};

export const PositionsTable = ({ rows, departmentNameById, detailHrefBase }: Props) => {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconBriefcase2 className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">
                    No positions yet.
                </div>
                <div className="max-w-80 text-sm text-(--muted)">
                    Define positions before linking compensation records to them.
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
