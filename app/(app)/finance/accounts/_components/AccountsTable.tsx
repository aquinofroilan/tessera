import Link from "next/link";
import { IconHash } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { AccountResponse, AccountType } from "@/lib/api/finance/accounts";

const typeLabels: Record<AccountType, string> = {
    ASSET: "Asset",
    LIABILITY: "Liability",
    EQUITY: "Equity",
    REVENUE: "Revenue",
    EXPENSE: "Expense",
};

const typeTones: Record<AccountType, string> = {
    ASSET: "bg-(--sky-soft) text-(--sky)",
    LIABILITY: "bg-(--ochre-soft) text-(--ochre)",
    EQUITY: "bg-(--plum-soft) text-(--plum)",
    REVENUE: "bg-(--moss-soft) text-(--moss)",
    EXPENSE: "bg-(--accent-soft) text-(--accent-deep)",
};

export function AccountsTable({ rows }: { rows: AccountResponse[] }) {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconHash className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">
                    No accounts match your filters.
                </div>
                <div className="max-w-80 text-sm text-(--muted)">Try clearing the search or switching type.</div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[110px]">Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-[120px]">Type</TableHead>
                        <TableHead className="w-[120px]">Tags</TableHead>
                        <TableHead className="w-[90px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((acc) => (
                        <TableRow key={acc.id}>
                            <TableCell className="font-mono text-[12px] tracking-[0.04em] text-(--ink)">
                                {acc.code}
                            </TableCell>
                            <TableCell>
                                <Link
                                    href={`/finance/accounts/${acc.id}`}
                                    className={cn(
                                        "font-medium text-(--ink) hover:text-(--accent)",
                                        acc.parentId && "ml-4 font-normal text-(--ink-soft)",
                                    )}>
                                    {acc.parentId && <span className="mr-1.5 text-(--muted)">↳</span>}
                                    {acc.name}
                                </Link>
                                {acc.description && (
                                    <span className="block text-[11px] text-(--muted)">{acc.description}</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <span
                                    className={cn(
                                        "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase",
                                        typeTones[acc.type],
                                    )}>
                                    {typeLabels[acc.type]}
                                </span>
                            </TableCell>
                            <TableCell>
                                {acc.isSystemAccount && (
                                    <span className="inline-flex items-center rounded-full bg-(--paper-2) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--ink-soft) uppercase">
                                        System
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>
                                <span
                                    className={
                                        acc.isActive
                                            ? "inline-flex items-center rounded-full bg-(--moss-soft) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--moss) uppercase"
                                            : "inline-flex items-center rounded-full bg-(--paper-3) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--muted) uppercase"
                                    }>
                                    {acc.isActive ? "Active" : "Archived"}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
