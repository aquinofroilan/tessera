import type { Metadata } from "next";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { listAssets } from "@/lib/api/assets/assets-dal";
import { getDepreciationSchedule } from "@/lib/api/assets/reports-dal";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { ScheduleControls } from "./_components/ScheduleControls";

export const metadata: Metadata = {
    title: "Depreciation schedule · Tessera",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const parseInt0 = (raw: string | string[] | undefined, fallback: number): number => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (!v) return fallback;
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
};

const parseStr = (raw: string | string[] | undefined): string | undefined => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    return v?.trim() || undefined;
};

const formatPeriod = (year: number, month: number): string => `${year}-${String(month).padStart(2, "0")}`;

const DepreciationSchedulePage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const assetId = parseStr(sp.assetId);
    const months = parseInt0(sp.months, 12);

    const [report, assets] = await Promise.all([
        getDepreciationSchedule({ assetId, months }),
        listAssets({ status: "ACTIVE" }),
    ]);

    const rowsByAsset = report.rows.reduce<Record<string, typeof report.rows>>((acc, row) => {
        const bucket = acc[row.assetNumber] ?? [];
        bucket.push(row);
        acc[row.assetNumber] = bucket;
        return acc;
    }, {});

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Assets", href: "/assets" },
                    { label: "Reports", href: "/assets/reports" },
                    { label: "Depreciation schedule" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Fixed assets · Report"
                        title={
                            <>
                                Depreciation schedule<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description={`Projecting forward ${months} month${months === 1 ? "" : "s"} from today across ${report.assetCount} active asset${report.assetCount === 1 ? "" : "s"}.`}
                    />

                    <Block title="Filters" description="Pick an asset to drill down; otherwise it's every ACTIVE asset.">
                        <ScheduleControls
                            assets={assets.map((a) => ({ id: a.id, label: `${a.assetNumber} · ${a.name}` }))}
                            initialAssetId={assetId ?? ""}
                            initialMonths={months}
                        />
                    </Block>

                    {Object.keys(rowsByAsset).length === 0 ? (
                        <Block title="Projection" description="Nothing to project — no active assets had remaining depreciation in the window.">
                            <Card className="px-6 py-12 text-center text-[13px] text-(--muted)">
                                Nothing to display for this filter.
                            </Card>
                        </Block>
                    ) : (
                        Object.entries(rowsByAsset).map(([assetNumber, rows]) => (
                            <Block
                                key={assetNumber}
                                title={assetNumber}
                                description={`${rows.length} period${rows.length === 1 ? "" : "s"} of remaining depreciation.`}>
                                <Card className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[140px]">Period</TableHead>
                                                <TableHead className="w-[140px] text-right">Depreciation</TableHead>
                                                <TableHead className="w-[160px] text-right">Cumulative</TableHead>
                                                <TableHead className="w-[160px] text-right">NBV</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rows.map((row, i) => (
                                                <TableRow key={`${row.assetId}-${row.periodYear}-${row.periodMonth}-${i}`}>
                                                    <TableCell className="font-mono text-[12px] tabular-nums">
                                                        {formatPeriod(row.periodYear, row.periodMonth)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-[13px] tabular-nums">
                                                        {row.depreciationAmount}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-[12px] text-(--ink-soft) tabular-nums">
                                                        {row.cumulativeDepreciation}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-[13px] text-foreground tabular-nums">
                                                        {row.netBookValue}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </Block>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default DepreciationSchedulePage;
