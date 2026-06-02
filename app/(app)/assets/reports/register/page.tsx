import type { Metadata } from "next";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { AssetStatus } from "@/lib/api/assets/assets";
import { getAssetRegister } from "@/lib/api/assets/reports-dal";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { AssetStatusBadge } from "../../_components/AssetStatusBadge";

export const metadata: Metadata = {
    title: "Asset register · Tessera",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const STATUSES: readonly AssetStatus[] = ["ACTIVE", "DISPOSED", "FULLY_DEPRECIATED"];

const parseStatus = (raw: string | string[] | undefined): AssetStatus | undefined => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    return STATUSES.includes(v as AssetStatus) ? (v as AssetStatus) : undefined;
};

const AssetRegisterPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const status = parseStatus(sp.status);
    const report = await getAssetRegister({ status });

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Assets", href: "/assets" },
                    { label: "Reports", href: "/assets/reports" },
                    { label: "Register" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Fixed assets · Report"
                        title={
                            <>
                                Asset register<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description={
                            status
                                ? `Filtered to ${status.toLowerCase().replace("_", " ")}.`
                                : "Every asset on the books, with totals."
                        }
                    />

                    <Block
                        title="Totals"
                        description="Roll-up across the filtered rows.">
                        <Card className="p-6">
                            <dl className="grid gap-x-8 gap-y-4 md:grid-cols-3">
                                <div className="flex flex-col gap-1">
                                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                        Cost
                                    </dt>
                                    <dd className="font-display text-foreground text-2xl font-[380] tabular-nums">
                                        {report.totalAcquisitionCost}
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                        Accumulated
                                    </dt>
                                    <dd className="font-display text-foreground text-2xl font-[380] tabular-nums">
                                        {report.totalAccumulatedDepreciation}
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                        Net book value
                                    </dt>
                                    <dd className="font-display text-foreground text-2xl font-[380] tabular-nums">
                                        {report.totalNetBookValue}
                                    </dd>
                                </div>
                            </dl>
                        </Card>
                    </Block>

                    <Block title="Rows" description={`${report.rows.length} asset${report.rows.length === 1 ? "" : "s"}.`}>
                        <Card className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px]">Asset #</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="w-[140px]">Category</TableHead>
                                        <TableHead className="w-[110px] text-right">Cost</TableHead>
                                        <TableHead className="w-[110px] text-right">Accum.</TableHead>
                                        <TableHead className="w-[110px] text-right">NBV</TableHead>
                                        <TableHead className="w-[140px]">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {report.rows.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell className="font-mono text-[12px] tabular-nums">
                                                {row.assetNumber}
                                            </TableCell>
                                            <TableCell>
                                                <div className="grid gap-0.5">
                                                    <span className="text-foreground text-[14px] font-medium">
                                                        {row.name}
                                                    </span>
                                                    {row.location && (
                                                        <span className="text-[12px] text-(--ink-soft)">
                                                            {row.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[13px] text-(--ink-soft)">
                                                {row.categoryCode ? `${row.categoryCode} · ${row.categoryName}` : "—"}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[12px] tabular-nums">
                                                {row.acquisitionCost}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[12px] tabular-nums">
                                                {row.accumulatedDepreciation}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[13px] text-foreground tabular-nums">
                                                {row.netBookValue}
                                            </TableCell>
                                            <TableCell>
                                                <AssetStatusBadge status={row.status} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default AssetRegisterPage;
