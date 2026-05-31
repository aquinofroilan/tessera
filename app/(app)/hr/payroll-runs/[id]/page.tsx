import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { getPayrollRun } from "@/lib/api/hr/payroll-runs-dal";
import { PayrollRunStatusBadge } from "../../_components/PayrollRunStatusBadge";
import { ProfileGrid, type ProfileRow } from "../../_components/ProfileGrid";
import { PayrollRunActions } from "./_components/PayrollRunActions";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const run = await getPayrollRun(id);
    return { title: run ? `${run.runNumber} · Tessera` : "Payroll run · Tessera" };
};

const PayrollRunDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const run = await getPayrollRun(id);
    if (!run) notFound();

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "HR", href: "/hr" },
                    { label: "Payroll runs", href: "/hr/payroll-runs" },
                    { label: run.runNumber },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Payroll runs"
                        title={run.runNumber}
                        description={`${run.periodStart} → ${run.periodEnd} · paid ${run.payDate}.`}
                        actions={<PayrollRunStatusBadge status={run.status} />}
                    />

                    <Block title="Summary" description="Totals, GL postings, and lifecycle timestamps.">
                        <ProfileGrid
                            rows={
                                [
                                    {
                                        label: "Total gross",
                                        value: (
                                            <span className="font-mono tabular-nums">
                                                {run.totalGross} {run.currency}
                                            </span>
                                        ),
                                    },
                                    { label: "Lines", value: String(run.lines.length) },
                                    {
                                        label: "Accrual JE",
                                        value: run.accrualJournalEntryId ? (
                                            <Link
                                                href={`/finance/journal/${run.accrualJournalEntryId}`}
                                                className="text-(--accent) hover:underline">
                                                View entry
                                            </Link>
                                        ) : (
                                            <span className="text-(--muted)">Not yet posted</span>
                                        ),
                                    },
                                    {
                                        label: "Payment JE",
                                        value: run.paymentJournalEntryId ? (
                                            <Link
                                                href={`/finance/journal/${run.paymentJournalEntryId}`}
                                                className="text-(--accent) hover:underline">
                                                View entry
                                            </Link>
                                        ) : (
                                            <span className="text-(--muted)">Not yet posted</span>
                                        ),
                                    },
                                    { label: "Approved", value: run.approvedAt ?? "—" },
                                    { label: "Paid", value: run.paidAt ?? "—" },
                                ] satisfies ProfileRow[]
                            }
                        />
                    </Block>

                    <Block
                        title="Pay lines"
                        description="Snapshot of each active employee's current compensation, expressed as monthly gross.">
                        <Card className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60px] text-right">#</TableHead>
                                        <TableHead className="w-[120px]">Number</TableHead>
                                        <TableHead>Employee</TableHead>
                                        <TableHead className="text-right">Gross amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {run.lines.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-(--muted)">
                                                No eligible employees in this period.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {run.lines.map((line) => (
                                        <TableRow key={line.id}>
                                            <TableCell className="text-right font-mono text-[12px] text-(--muted) tabular-nums">
                                                {line.lineNumber}
                                            </TableCell>
                                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                                {line.employeeNumber}
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`/hr/employees/${line.employeeId}`}
                                                    className="text-(--ink) hover:text-(--accent)">
                                                    {line.employeeName}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[13px] text-(--ink) tabular-nums">
                                                {line.grossAmount} {run.currency}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </Block>

                    <Block
                        title="Decisions"
                        description="Approve posts the accrual to GL. Pay posts the cash leg. Cancel is DRAFT-only — once approved, the run is permanent and any reversal must come through a manual journal entry.">
                        <PayrollRunActions runId={run.id} status={run.status} />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default PayrollRunDetailPage;
