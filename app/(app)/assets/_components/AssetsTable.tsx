import Link from "next/link";
import { IconPackage } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { FixedAssetResponse } from "@/lib/api/assets/assets";
import { AssetStatusBadge } from "./AssetStatusBadge";

type Props = {
    rows: FixedAssetResponse[];
    categoryNameById: Record<string, string>;
    detailHrefBase: string;
};

export function AssetsTable({ rows, categoryNameById, detailHrefBase }: Props) {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconPackage className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380]">No assets registered yet.</div>
                <div className="max-w-80 text-sm text-(--muted)">
                    Add your first capital asset to start depreciating it on the books.
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Asset #</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-[160px]">Category</TableHead>
                        <TableHead className="w-[120px] text-right">Cost</TableHead>
                        <TableHead className="w-[120px] text-right">NBV</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((asset) => (
                        <TableRow key={asset.id}>
                            <TableCell>
                                <Link
                                    href={`${detailHrefBase}/${asset.id}`}
                                    className="font-mono text-[12px] tracking-[0.04em] text-foreground uppercase no-underline hover:text-(--accent)">
                                    {asset.assetNumber}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <div className="grid gap-0.5">
                                    <span className="text-foreground text-[14px] font-medium">{asset.name}</span>
                                    {asset.location && (
                                        <span className="text-[12px] text-(--ink-soft)">{asset.location}</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-[13px] text-(--ink-soft)">
                                {asset.categoryId ? (categoryNameById[asset.categoryId] ?? "—") : "—"}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[12px] tabular-nums">
                                {asset.acquisitionCost}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[13px] text-foreground tabular-nums">
                                {asset.netBookValue}
                            </TableCell>
                            <TableCell>
                                <AssetStatusBadge status={asset.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
