import Link from "next/link";
import { IconBookOff } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { JournalEntryResponse } from "@/lib/api/finance/journal";
import { StatusBadge } from "../../_components/StatusBadge";
import { formatDateShort, formatMoney } from "../../_data/format";

function totalDebit(entry: JournalEntryResponse) {
    return entry.lines.reduce((sum, l) => sum + Number(l.debit), 0).toFixed(2);
}

const sourceLabels: Record<JournalEntryResponse["source"], string> = {
    MANUAL: "Manual",
    SYSTEM: "System",
};

export function JournalTable({ rows }: { rows: JournalEntryResponse[] }) {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconBookOff className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">
                    No journal entries match your filters.
                </div>
                <div className="max-w-80 text-sm text-(--muted)">
                    Try clearing the search or selecting a different status.
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[140px]">Entry #</TableHead>
                        <TableHead className="w-[80px]">Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[80px]">Source</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-[110px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell>
                                <Link
                                    href={`/finance/journal/${entry.id}`}
                                    className="font-mono text-[12px] tracking-[0.04em] text-(--ink) hover:text-(--accent)">
                                    {entry.entryNumber}
                                </Link>
                            </TableCell>
                            <TableCell className="text-[13px] text-(--ink-soft)">
                                {formatDateShort(entry.date)}
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">
                                <span className="block text-(--ink)">{entry.description}</span>
                                {entry.sourceReference && (
                                    <span className="block font-mono text-[11px] text-(--muted)">
                                        {entry.sourceReference}
                                    </span>
                                )}
                            </TableCell>
                            <TableCell className="font-mono text-[10px] tracking-[0.08em] text-(--muted) uppercase">
                                {sourceLabels[entry.source]}
                            </TableCell>
                            <TableCell className="text-right font-medium tabular-nums">
                                {formatMoney(totalDebit(entry), "USD")}
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={entry.status === "VOIDED" ? "VOIDED" : entry.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
