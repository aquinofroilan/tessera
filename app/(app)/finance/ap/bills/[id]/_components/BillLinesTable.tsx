import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { BillResponse } from "@/lib/api/finance/bills";
import { formatMoney } from "../../../../_data/format";

export function BillLinesTable({ bill }: { bill: BillResponse }) {
    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Account</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bill.lines.map((line, i) => (
                        <TableRow key={`${line.accountId}-${i}`}>
                            <TableCell>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-mono text-[12px] tracking-[0.04em] text-(--ink)">
                                        {line.accountCode}
                                    </span>
                                    <span className="text-[11px] text-(--muted)">{line.accountName}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-(--ink)">{line.description ?? "—"}</TableCell>
                            <TableCell className="text-right">{formatMoney(line.amount, bill.currencyCode)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex flex-col items-end gap-1.5 border-t border-(--rule) px-6 py-4 text-[13px]">
                <div className="flex w-60 justify-between text-(--ink-soft)">
                    <span>Subtotal</span>
                    <span className="tabular-nums">
                        {formatMoney((Number(bill.totalAmount) - Number(bill.taxAmount)).toFixed(2), bill.currencyCode)}
                    </span>
                </div>
                <div className="flex w-60 justify-between text-(--ink-soft)">
                    <span>Tax</span>
                    <span className="tabular-nums">{formatMoney(bill.taxAmount, bill.currencyCode)}</span>
                </div>
                <div className="flex w-60 justify-between border-t border-(--rule-soft) pt-1.5 font-medium text-(--ink)">
                    <span>Total</span>
                    <span className="tabular-nums">{formatMoney(bill.totalAmount, bill.currencyCode)}</span>
                </div>
            </div>
        </Card>
    );
}
