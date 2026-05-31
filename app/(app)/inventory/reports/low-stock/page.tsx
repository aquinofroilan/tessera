import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";

import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { listLowStock } from "@/lib/api/inventory/low-stock-dal";
import { formatQuantity } from "../../_data/format";
import { StockLevelBadge } from "../../_components/StockLevelBadge";

export const metadata: Metadata = {
    title: "Low stock · Tessera",
    description: "Items at or below their reorder point.",
};

const LowStockReportPage = async () => {
    const rows = await listLowStock();

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Inventory", href: "/inventory" },
                    { label: "Reports" },
                    { label: "Low stock" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Inventory · Reports"
                        title="Low stock"
                        description="Items at or below their reorder point. Stays visible here even after notifications ship."
                    />

                    <Block
                        title="At or below reorder point"
                        description={`${rows.length} item${rows.length === 1 ? "" : "s"}.`}>
                        {rows.length === 0 ? (
                            <Card className="items-center gap-3 px-6 py-12 text-center">
                                <span className="grid size-10 place-items-center rounded-full bg-(--moss-soft) text-(--moss)">
                                    <IconCheck className="size-5" stroke={1.8} />
                                </span>
                                <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">
                                    All items are above their reorder points.
                                </div>
                            </Card>
                        ) : (
                            <Card className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[140px]">SKU</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="w-[140px] text-right">On hand</TableHead>
                                            <TableHead className="w-[140px] text-right">Reorder point</TableHead>
                                            <TableHead className="w-[140px] text-right">Suggested qty</TableHead>
                                            <TableHead>Primary vendor</TableHead>
                                            <TableHead className="w-[120px]" />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rows.map((row) => {
                                            const buyHref = row.primaryVendorId
                                                ? `/finance/ap/bills/new?vendorId=${row.primaryVendorId}&itemId=${row.itemId}`
                                                : null;
                                            return (
                                                <TableRow key={row.itemId}>
                                                    <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                                        {row.sku}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link
                                                            href={`/inventory/items/${row.itemId}`}
                                                            className="font-medium text-(--ink) hover:text-(--accent)">
                                                            {row.name}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                                        <span className="inline-flex items-center gap-2">
                                                            <StockLevelBadge
                                                                onHand={row.onHand}
                                                                reorderPoint={row.reorderPoint}
                                                            />
                                                            {formatQuantity(row.onHand, row.unitOfMeasure)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                                        {formatQuantity(row.reorderPoint, row.unitOfMeasure)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                                        {row.reorderQuantity != null
                                                            ? formatQuantity(row.reorderQuantity, row.unitOfMeasure)
                                                            : "—"}
                                                    </TableCell>
                                                    <TableCell className="text-(--ink-soft)">
                                                        {row.primaryVendorName ?? "—"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {buyHref ? (
                                                            <Link
                                                                href={buyHref}
                                                                className="inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.02em] text-(--accent) hover:underline">
                                                                Create bill
                                                                <IconArrowRight className="size-3" stroke={1.8} />
                                                            </Link>
                                                        ) : (
                                                            <span className="text-(--muted)">—</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
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

export default LowStockReportPage;
