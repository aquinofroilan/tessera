import type { Metadata } from "next";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { getStockOnHand } from "@/lib/api/inventory/reports-dal";
import { formatQuantity, formatQuantityNumber } from "../../_data/format";

export const metadata: Metadata = {
    title: "Stock on hand · Tessera",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const StockOnHandReport = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const asOfDate = Array.isArray(sp.asOfDate) ? sp.asOfDate[0] : sp.asOfDate;
    const report = await getStockOnHand({ asOfDate });

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Inventory", href: "/inventory" },
                    { label: "Reports", href: "/inventory/reports" },
                    { label: "Stock on hand" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Inventory · Reports"
                        title="Stock on hand"
                        description={`Item × warehouse pivot as of ${report.asOfDate}.`}
                    />

                    <Block
                        title={`${report.rows.length} item${report.rows.length === 1 ? "" : "s"}`}
                        description={`${report.warehouses.length} warehouse${report.warehouses.length === 1 ? "" : "s"} in view.`}>
                        <Card className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[140px]">SKU</TableHead>
                                        <TableHead>Item</TableHead>
                                        {report.warehouses.map((w) => (
                                            <TableHead key={w.id} className="text-right">
                                                {w.code}
                                            </TableHead>
                                        ))}
                                        <TableHead className="w-[120px] text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {report.rows.map((row) => (
                                        <TableRow key={row.itemId}>
                                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                                {row.sku}
                                            </TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            {report.warehouses.map((w) => (
                                                <TableCell
                                                    key={w.id}
                                                    className="text-right font-mono text-[12px] tabular-nums text-(--ink-soft)">
                                                    {formatQuantityNumber(row.quantitiesByWarehouse[w.id] ?? 0)}
                                                </TableCell>
                                            ))}
                                            <TableCell className="text-right font-mono text-[12px] font-medium tabular-nums text-(--ink)">
                                                {formatQuantity(row.totalQuantity, row.unitOfMeasure)}
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

export default StockOnHandReport;
