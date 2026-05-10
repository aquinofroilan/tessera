import Link from "next/link";
import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { formatDateShort, formatMoney } from "../_data/format";
import { recentJournal } from "../_data/mock";
import { StatusBadge } from "./StatusBadge";

export function RecentJournal() {
    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Entry</TableHead>
                        <TableHead className="w-[90px]">Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[90px]">Source</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentJournal.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <Link href={`/finance/journal/${row.id}`} className="block">
                                    <span className="font-mono text-[12px] tracking-[0.04em] text-(--ink)">
                                        {row.entryNumber}
                                    </span>
                                </Link>
                            </TableCell>
                            <TableCell className="text-[13px] text-(--ink-soft)">
                                {formatDateShort(row.date)}
                            </TableCell>
                            <TableCell className="text-(--ink)">{row.description}</TableCell>
                            <TableCell>
                                <span className="font-mono text-[10px] tracking-[0.08em] text-(--muted) uppercase">
                                    {row.source}
                                </span>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {formatMoney(row.amount, row.currencyCode)}
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={row.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
