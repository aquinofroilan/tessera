import type { Metadata } from "next";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { getValuation } from "@/lib/api/inventory/reports-dal";
import { formatMoney } from "../../../finance/_data/format";
import { formatQuantity } from "../../_data/format";

export const metadata: Metadata = {
    title: "Inventory valuation · Loom",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ValuationReportPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const asOfDate = Array.isArray(sp.asOfDate) ? sp.asOfDate[0] : sp.asOfDate;
    const report = await getValuation(asOfDate);
    const currency = report.currencyCode || "USD";
    const varianceNonZero = Number(report.variance) !== 0;

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Inventory", href: "/inventory" },
                    { label: "Reports", href: "/inventory/reports" },
                    { label: "Valuation" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Inventory · Reports"
                        title="Valuation"
                        description={`Per-item carrying value as of ${report.asOfDate}. Reconciles to GL 1300 (inventory asset).`}
                    />

                    <Block title="Reconciliation" description="Computed total vs GL inventory balance — variance is a red flag.">
                        <Card className="p-6">
                            <dl className="grid gap-x-8 gap-y-4 md:grid-cols-3">
                                <div className="flex flex-col gap-1">
                                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                        Computed total
                                    </dt>
                                    <dd className="font-mono text-[18px] font-medium tabular-nums text-(--ink)">
                                        {formatMoney(report.totalValue, currency)}
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                        GL 1300 balance
                                    </dt>
                                    <dd className="font-mono text-[18px] font-medium tabular-nums text-(--ink)">
                                        {formatMoney(report.glInventoryBalance, currency)}
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                        Variance
                                    </dt>
                                    <dd
                                        className={`font-mono text-[18px] font-medium tabular-nums ${
                                            varianceNonZero ? "text-(--accent)" : "text-(--moss)"
                                        }`}>
                                        {formatMoney(report.variance, currency)}
                                    </dd>
                                </div>
                            </dl>
                        </Card>
                    </Block>

                    <Block
                        title="Per-item carrying value"
                        description={`${report.rows.length} item${report.rows.length === 1 ? "" : "s"} with on-hand stock.`}>
                        <Card className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[140px]">SKU</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="w-[140px] text-right">Quantity</TableHead>
                                        <TableHead className="w-[140px] text-right">Unit cost</TableHead>
                                        <TableHead className="w-[160px] text-right">Carrying value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {report.rows.map((row) => (
                                        <TableRow key={row.itemId}>
                                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                                {row.sku}
                                            </TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell className="text-right font-mono text-[12px] tabular-nums text-(--ink-soft)">
                                                {formatQuantity(row.totalQuantity, row.unitOfMeasure)}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[12px] tabular-nums text-(--ink-soft)">
                                                {formatMoney(row.unitCost, currency)}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-[12px] tabular-nums text-(--ink)">
                                                {formatMoney(row.totalValue, currency)}
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

export default ValuationReportPage;
