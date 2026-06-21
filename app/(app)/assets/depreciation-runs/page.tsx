import type { Metadata } from "next";
import Link from "next/link";
import { IconCalendarStats, IconPlus } from "@tabler/icons-react";

import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { listDepreciationRuns } from "@/lib/api/assets/depreciation-dal";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { DepreciationStatusBadge } from "./_components/DepreciationStatusBadge";

export const metadata: Metadata = {
    title: "Depreciation runs · Tessera",
    description: "Monthly depreciation calculations and the journal entries they post.",
};

const formatPeriod = (year: number, month: number): string => `${year}-${String(month).padStart(2, "0")}`;

const DepreciationRunsPage = async () => {
    const runs = await listDepreciationRuns();

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Assets", href: "/assets" },
                    { label: "Depreciation runs" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow="Fixed assets"
                        title={
                            <>
                                Depreciation runs<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Calculate monthly depreciation, review the lines, then post a single GL entry that touches all the asset rows in one shot."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/assets/depreciation-runs/new">
                                    <IconPlus stroke={1.8} />
                                    New run
                                </Link>
                            </Button>
                        }
                    />

                    <Block title="History" description={`${runs.length} period${runs.length === 1 ? "" : "s"} on record.`}>
                        {runs.length === 0 ? (
                            <Card className="items-center gap-3 px-6 py-12 text-center">
                                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                                    <IconCalendarStats className="size-5" stroke={1.6} />
                                </span>
                                <div className="font-display text-foreground text-xl font-[380]">No runs yet.</div>
                                <div className="max-w-80 text-sm text-(--muted)">
                                    Start one for the current month — drafts are recomputed every time you re-create them, so iterate freely.
                                </div>
                            </Card>
                        ) : (
                            <Card className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[140px]">Period</TableHead>
                                            <TableHead className="w-[140px]">Status</TableHead>
                                            <TableHead className="w-[160px] text-right">Total</TableHead>
                                            <TableHead className="w-[160px]">Posted at</TableHead>
                                            <TableHead>Journal entry</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {runs.map((run) => (
                                            <TableRow key={run.id}>
                                                <TableCell>
                                                    <Link
                                                        href={`/assets/depreciation-runs/${run.id}`}
                                                        className="font-mono text-[12px] tracking-[0.04em] text-foreground no-underline hover:text-(--accent)">
                                                        {formatPeriod(run.periodYear, run.periodMonth)}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <DepreciationStatusBadge status={run.status} />
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-[13px] text-foreground tabular-nums">
                                                    {run.totalDepreciation}
                                                </TableCell>
                                                <TableCell className="font-mono text-[11px] tabular-nums text-(--muted)">
                                                    {run.postedAt?.slice(0, 19).replace("T", " ") ?? "—"}
                                                </TableCell>
                                                <TableCell className="font-mono text-[11px] text-(--ink-soft)">
                                                    {run.journalEntryId ?? "—"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}
                    </Block>
                </div>
            </div>
        </>
    );
};

export default DepreciationRunsPage;
