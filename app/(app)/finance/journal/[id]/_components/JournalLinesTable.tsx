import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { JournalEntryResponse } from "@/lib/api/finance/journal";
import { formatMoney } from "../../../_data/format";

export function JournalLinesTable({ entry }: { entry: JournalEntryResponse }) {
    const totalDebit = entry.lines.reduce((sum, l) => sum + Number(l.debit), 0);
    const totalCredit = entry.lines.reduce((sum, l) => sum + Number(l.credit), 0);
    const balanced = Math.abs(totalDebit - totalCredit) < 0.005;

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[140px]">Account</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[140px] text-right">Debit</TableHead>
                        <TableHead className="w-[140px] text-right">Credit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entry.lines.map((line, i) => {
                        const debitNum = Number(line.debit);
                        const creditNum = Number(line.credit);
                        return (
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
                                <TableCell className="text-right font-mono text-[13px] tabular-nums">
                                    {debitNum > 0 ? formatMoney(line.debit, "USD") : "—"}
                                </TableCell>
                                <TableCell className="text-right font-mono text-[13px] tabular-nums">
                                    {creditNum > 0 ? formatMoney(line.credit, "USD") : "—"}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <div className="flex items-center justify-end gap-8 border-t border-(--rule) px-6 py-4 text-[13px]">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] tracking-[0.16em] text-(--muted) uppercase">Totals</span>
                    <span
                        className={
                            balanced
                                ? "rounded-full bg-(--moss-soft) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--moss) uppercase"
                                : "rounded-full bg-(--accent-soft) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--accent-deep) uppercase"
                        }>
                        {balanced ? "Balanced" : "Unbalanced"}
                    </span>
                </div>
                <div className="flex w-[140px] justify-end font-mono tabular-nums">
                    {formatMoney(totalDebit.toFixed(2), "USD")}
                </div>
                <div className="flex w-[140px] justify-end font-mono tabular-nums">
                    {formatMoney(totalCredit.toFixed(2), "USD")}
                </div>
            </div>
        </Card>
    );
}
