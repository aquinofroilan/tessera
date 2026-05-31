import Link from "next/link";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { MovementHistoryResponse } from "@/lib/api/inventory/reports";
import { formatMoney } from "../../../../finance/_data/format";
import { MovementTypeBadge } from "../../../_components/MovementTypeBadge";

type ItemMovementsBlockProps = {
    history: MovementHistoryResponse;
    itemId: string;
};

const yearAgoIsoDate = (): string => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const ItemMovementsBlock = ({ history, itemId }: ItemMovementsBlockProps) => {
    const currency = history.currencyCode || "USD";
    const rows = history.rows.slice(0, 10);
    const reportHref = `/inventory/reports/movements?itemId=${itemId}&startDate=${yearAgoIsoDate()}`;

    if (rows.length === 0) {
        return (
            <Card className="items-center gap-2 px-6 py-8 text-center">
                <div className="text-sm text-(--muted)">
                    No movements in the last 30 days. Open the{" "}
                    <Link href={reportHref} className="text-(--accent) hover:underline">
                        full history report
                    </Link>{" "}
                    for older entries.
                </div>
            </Card>
        );
    }

    return (
        <div className="grid gap-3">
            <Card className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[110px]">Date</TableHead>
                            <TableHead className="w-[140px]">Type</TableHead>
                            <TableHead>Warehouse</TableHead>
                            <TableHead className="w-[110px] text-right">Qty</TableHead>
                            <TableHead className="w-[110px] text-right">Running</TableHead>
                            <TableHead className="w-[140px] text-right">Value Δ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row, i) => (
                            <TableRow key={`${row.movementId}-${i}`}>
                                <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                    <Link
                                        href={`/inventory/movements/${row.movementId}`}
                                        className="hover:text-(--accent)">
                                        {row.date}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <MovementTypeBadge type={row.type} />
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
            <div className="text-right">
                <Link
                    href={reportHref}
                    className="font-mono text-[11px] tracking-[0.02em] text-(--accent) hover:underline">
                    See full history →
                </Link>
            </div>
        </div>
    );
};
