import Link from "next/link";
import { IconUserOff } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";

export type PartyRow = {
    id: string;
    name: string;
    contactName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    paymentTermDays: number;
    isActive: boolean;
};

type PartiesTableProps = {
    rows: PartyRow[];
    detailHrefBase: string;
    emptyHeading: string;
    emptyDescription: string;
    nameHeader: string;
};

export const PartiesTable = ({
    rows,
    detailHrefBase,
    emptyHeading,
    emptyDescription,
    nameHeader,
}: PartiesTableProps) => {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconUserOff className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">{emptyHeading}</div>
                <div className="max-w-80 text-sm text-(--muted)">{emptyDescription}</div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{nameHeader}</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="w-[120px]">Phone</TableHead>
                        <TableHead className="w-[110px] text-right">Terms</TableHead>
                        <TableHead className="w-[90px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                <Link
                                    href={`${detailHrefBase}/${row.id}`}
                                    className="font-medium text-(--ink) hover:text-(--accent)">
                                    {row.name}
                                </Link>
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">{row.contactName ?? "—"}</TableCell>
                            <TableCell className="text-(--ink-soft)">
                                {row.contactEmail ? (
                                    <a
                                        href={`mailto:${row.contactEmail}`}
                                        className="font-mono text-[12px] tracking-[0.02em] hover:text-(--accent)">
                                        {row.contactEmail}
                                    </a>
                                ) : (
                                    "—"
                                )}
                            </TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                {row.contactPhone ?? "—"}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                Net {row.paymentTermDays}
                            </TableCell>
                            <TableCell>
                                <span
                                    className={
                                        row.isActive
                                            ? "inline-flex items-center rounded-full bg-(--moss-soft) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--moss) uppercase"
                                            : "inline-flex items-center rounded-full bg-(--paper-3) px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--muted) uppercase"
                                    }>
                                    {row.isActive ? "Active" : "Archived"}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
