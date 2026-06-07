import Link from "next/link";
import { IconBriefcase2 } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { ProjectResponse } from "@/lib/api/projects/projects";
import { TableEmptyState } from "../../hr/_components/TableEmptyState";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

const BILLING_LABEL: Record<ProjectResponse["billingType"], string> = {
    TIME_AND_MATERIALS: "T&M",
    FIXED_PRICE: "Fixed",
    MILESTONE: "Milestone",
};

type Props = {
    rows: ProjectResponse[];
    customerNameById: Record<string, string>;
    detailHrefBase: string;
};

export const ProjectsTable = ({ rows, customerNameById, detailHrefBase }: Props) => {
    if (!rows.length) {
        return (
            <TableEmptyState
                icon={IconBriefcase2}
                title="No projects yet."
                hint="Spin up a project to start tracking time, budget, and billing."
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
                        <TableHead>Customer</TableHead>
                        <TableHead className="w-[110px]">Billing</TableHead>
                        <TableHead className="w-[120px]">Start</TableHead>
                        <TableHead className="w-[120px]">End</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                {row.projectNumber}
                            </TableCell>
                            <TableCell>
                                <Link
                                    href={`${detailHrefBase}/${row.id}`}
                                    className="font-medium text-(--ink) hover:text-(--accent)">
                                    {row.name}
                                </Link>
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">
                                {row.customerId ? (customerNameById[row.customerId] ?? "—") : "—"}
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">{BILLING_LABEL[row.billingType]}</TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.startDate}
                            </TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.endDate ?? "—"}
                            </TableCell>
                            <TableCell>
                                <ProjectStatusBadge status={row.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
