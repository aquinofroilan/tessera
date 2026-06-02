import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { listAssets } from "@/lib/api/assets/assets-dal";
import { getDepreciationRun } from "@/lib/api/assets/depreciation-dal";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { DepreciationStatusBadge } from "../_components/DepreciationStatusBadge";
import { PostRunButton } from "./_components/PostRunButton";

type Props = { params: Promise<{ id: string }> };

const formatPeriod = (year: number, month: number): string => `${year}-${String(month).padStart(2, "0")}`;

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const run = await getDepreciationRun(id);
    return {
        title: run
            ? `Depreciation ${formatPeriod(run.periodYear, run.periodMonth)} · Tessera`
            : "Depreciation run · Tessera",
    };
};

const DepreciationRunDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const run = await getDepreciationRun(id);
    if (!run) notFound();

    const assets = await listAssets();
    const assetByIdShort = Object.fromEntries(assets.map((a) => [a.id, `${a.assetNumber} · ${a.name}`]));

    const period = formatPeriod(run.periodYear, run.periodMonth);
    const isDraft = run.status === "DRAFT";
    const linesMissingAccounts =
        run.lines?.filter((l) => !l.debitAccountId || !l.creditAccountId).length ?? 0;

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Assets", href: "/assets" },
                    { label: "Depreciation runs", href: "/assets/depreciation-runs" },
                    { label: period },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow="Fixed assets · Depreciation"
                        title={`Period ${period}`}
                        description={
                            isDraft
                                ? "Review the per-asset lines, then post to generate the GL entry."
                                : "Posted. The GL entry below was the result of this run."
                        }
                        actions={
                            <div className="flex flex-wrap items-center gap-2.5">
                                <DepreciationStatusBadge status={run.status} />
                                {isDraft && <PostRunButton id={run.id} />}
                            </div>
                        }
                    />

                    <Block
                        title="Summary"
                        description={
                            isDraft && linesMissingAccounts > 0
                                ? `${linesMissingAccounts} line${linesMissingAccounts === 1 ? "" : "s"} will be skipped from the JE — missing GL accounts on those assets.`
                                : `Total depreciation for this period.`
                        }>
                        <Card className="p-6">
                            <dl className="grid gap-x-8 gap-y-4 md:grid-cols-3">
                                <div className="flex flex-col gap-1">
                                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                        Total
                                    </dt>
                                    <dd className="font-display text-foreground text-2xl font-[380] tabular-nums">
                                        {run.totalDepreciation}
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                        Lines
                                    </dt>
                                    <dd className="font-display text-foreground text-2xl font-[380] tabular-nums">
                                        {run.lines?.length ?? 0}
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                        Journal entry
                                    </dt>
                                    <dd className="font-mono text-[12px] text-(--ink-soft)">
                                        {run.journalEntryId ?? "—"}
                                    </dd>
                                </div>
                            </dl>
                        </Card>
                    </Block>

                    <Block title="Lines" description="Per-asset breakdown.">
                        {run.lines && run.lines.length > 0 ? (
                            <Card className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Asset</TableHead>
                                            <TableHead className="w-[140px] text-right">Depreciation</TableHead>
                                            <TableHead className="w-[200px]">GL routing</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {run.lines.map((line) => (
                                            <TableRow key={line.id}>
                                                <TableCell className="text-[13px] text-(--ink-soft)">
                                                    {assetByIdShort[line.assetId] ?? line.assetId}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-[13px] tabular-nums">
                                                    {line.depreciationAmount}
                                                </TableCell>
                                                <TableCell className="font-mono text-[10px] tracking-[0.04em] text-(--muted)">
                                                    {line.debitAccountId && line.creditAccountId
                                                        ? "Configured"
                                                        : "Missing — skipped"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        ) : (
                            <Card className="px-6 py-12 text-center text-[13px] text-(--muted)">
                                No assets contributed depreciation this period.
                            </Card>
                        )}
                    </Block>
                </div>
            </div>
        </>
    );
};

export default DepreciationRunDetailPage;
