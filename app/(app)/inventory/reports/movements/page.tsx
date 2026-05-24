import type { Metadata } from "next";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { getMovementHistory } from "@/lib/api/inventory/reports-dal";
import { formatMoney } from "../../../finance/_data/format";
import { MovementTypeBadge } from "../../_components/MovementTypeBadge";

export const metadata: Metadata = {
    title: "Movement history · Loom",
};

const monthsAgo = (months: number): string => {
    const d = new Date();
    d.setMonth(d.getMonth() - months);
    return d.toISOString().slice(0, 10);
};

const today = (): string => new Date().toISOString().slice(0, 10);

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const MovementHistoryReportPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const get = (k: string): string | undefined => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]);

    const startDate = get("startDate") ?? monthsAgo(1);
    const endDate = get("endDate") ?? today();
    const itemId = get("itemId");
    const warehouseId = get("warehouseId");
    const type = get("type");

    const report = await getMovementHistory({ startDate, endDate, itemId, warehouseId, type });
    const currency = report.currencyCode || "USD";

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Inventory", href: "/inventory" },
                    { label: "Reports", href: "/inventory/reports" },
                    { label: "Movement history" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Inventory · Reports"
                        title="Movement history"
                        description={`Posted movements ${report.startDate} → ${report.endDate}. Running totals per item.`}
                    />

                    <Block
                        title="History"
                        description={`${report.rows.length} line${report.rows.length === 1 ? "" : "s"} in window.`}>
                        <Card className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[110px]">Date</TableHead>
                                        <TableHead className="w-[140px]">Type</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Warehouse</TableHead>
                                        <TableHead className="w-[110px] text-right">Qty</TableHead>
                                        <TableHead className="w-[110px] text-right">Running</TableHead>
                                        <TableHead className="w-[140px] text-right">Value Δ</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {report.rows.map((row, i) => (
                                        <TableRow key={`${row.movementId}-${i}`}>
                                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                                {row.date}
                                            </TableCell>
                                            <TableCell>
                                                <MovementTypeBadge type={row.type} />
                                            </TableCell>
                                            <TableCell>
                                                <span className="block font-medium text-(--ink)">{row.itemName}</span>
                                                <span className="block font-mono text-[11px] tracking-[0.02em] text-(--muted)">
                                                    {row.itemSku}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-(--ink-soft)">{row.warehouseName}</TableCell>
                                            <TableCell className="text-right font-mono text-[12px] tabular-nums text-(--ink-soft)">
                                                {row.quantity > 0 ? "+" : ""}
                                                {row.quantity}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[12px] tabular-nums text-(--ink)">
                                                {row.runningQuantity}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[12px] tabular-nums text-(--ink-soft)">
                                                {formatMoney(row.valueChange, currency)}
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

export default MovementHistoryReportPage;
