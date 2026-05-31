import Link from "next/link";
import { IconCash } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { PayrollRunResponse } from "@/lib/api/hr/payroll-runs";
import { PayrollRunStatusBadge } from "./PayrollRunStatusBadge";
import { TableEmptyState } from "./TableEmptyState";

type Props = {
    rows: PayrollRunResponse[];
    detailHrefBase: string;
};

export const PayrollRunsTable = ({ rows, detailHrefBase }: Props) => {
    if (!rows.length) {
        return (
            <TableEmptyState
                icon={IconCash}
                title="No payroll runs yet."
                hint="Create one to snapshot current compensation into pay lines and post to the GL."
            />
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[140px]">Number</TableHead>
                        <TableHead className="w-[110px]">Period start</TableHead>
                        <TableHead className="w-[110px]">Period end</TableHead>
                        <TableHead className="w-[110px]">Pay date</TableHead>
                        <TableHead className="w-[70px] text-right">Lines</TableHead>
                        <TableHead className="text-right">Total gross</TableHead>
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
                                    {row.runNumber}
                                </Link>
                            </TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.periodStart}
                            </TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.periodEnd}
                            </TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.payDate}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.lines.length}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[13px] text-(--ink) tabular-nums">
                                {row.totalGross} {row.currency}
                            </TableCell>
                            <TableCell>
                                <PayrollRunStatusBadge status={row.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
