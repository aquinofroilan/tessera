import Link from "next/link";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { ItemStockResponse } from "@/lib/api/inventory/stock";
import { formatMoney } from "../../../../finance/_data/format";
import { formatQuantity } from "../../../_data/format";

type ItemStockBlockProps = {
    stock: ItemStockResponse | null;
    unitOfMeasure: string;
    fallbackCurrency: string;
};

export const ItemStockBlock = ({ stock, unitOfMeasure, fallbackCurrency }: ItemStockBlockProps) => {
    if (!stock || stock.locations.length === 0) {
        return (
            <Card className="items-center gap-2 px-6 py-8 text-center">
                <div className="text-sm text-(--muted)">
                    No stock recorded yet. Post a{" "}
                    <Link href="/inventory/movements/new?type=RECEIPT" className="text-(--accent) hover:underline">
                        receipt
                    </Link>{" "}
                    to bring this item on hand.
                </div>
            </Card>
        );
    }

    const currency = stock.currencyCode || fallbackCurrency;

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Warehouse</TableHead>
                        <TableHead className="w-[140px] text-right">On hand</TableHead>
                        <TableHead className="w-[140px] text-right">Unit cost</TableHead>
                        <TableHead className="w-[160px] text-right">Carrying value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stock.locations.map((loc) => (
                        <TableRow key={loc.warehouseId}>
                            <TableCell>
                                <Link
                                    href={`/inventory/warehouses/${loc.warehouseId}`}
                                    className="font-medium text-(--ink) hover:text-(--accent)">
                                    {loc.warehouseName}
                                </Link>
                            </TableCell>
                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {formatQuantity(loc.quantity, unitOfMeasure)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {formatMoney(loc.unitCost, currency)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {formatMoney(loc.value, currency)}
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                            Total
                        </TableCell>
                        <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink) tabular-nums">
                            {formatQuantity(stock.totalQuantity, unitOfMeasure)}
                        </TableCell>
                        <TableCell />
                        <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] font-medium text-(--ink) tabular-nums">
                            {formatMoney(stock.totalValue, currency)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Card>
    );
};
