import Link from "next/link";
import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { formatDateShort, formatMoney } from "../_data/format";
import { invoiceQueue } from "../_data/mock";
import { OverdueCell } from "./OverdueDots";
import { StatusBadge } from "./StatusBadge";

export function ReceivablesQueue() {
    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[28%]">Invoice</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead className="text-right">Outstanding</TableHead>
                        <TableHead className="w-[110px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoiceQueue.map((row) => {
                        const outstanding = (Number(row.totalAmount) - Number(row.amountReceived)).toFixed(2);
                        return (
                            <TableRow key={row.id} className="cursor-pointer">
                                <TableCell>
                                    <Link href={`/finance/ar/invoices/${row.id}`} className="block">
                                        <span className="font-mono text-[12px] tracking-[0.04em] text-(--ink)">
                                            {row.invoiceNumber}
                                        </span>
                                    </Link>
                                </TableCell>
                                <TableCell className="text-(--ink-soft)">{row.customerName}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[13px] text-(--ink)">
                                            {formatDateShort(row.dueDate)}
                                        </span>
                                        <OverdueCell daysOverdue={row.daysOverdue} />
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatMoney(outstanding, row.currencyCode)}
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={row.status} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Card>
    );
}
