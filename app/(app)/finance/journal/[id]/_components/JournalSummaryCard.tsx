import { format, parseISO } from "date-fns";
import Link from "next/link";

import { Card, CardEyebrow } from "@/components/ui";
import type { JournalEntryResponse } from "@/lib/api/finance/journal";

function formatDateLong(iso: string) {
    return format(parseISO(iso), "MMM d, yyyy");
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <CardEyebrow>{label}</CardEyebrow>
            <div className="text-[14px] text-(--ink) tabular-nums">{children}</div>
        </div>
    );
}

function sourceHref(entry: JournalEntryResponse): string | null {
    if (!entry.sourceReference) return null;
    if (entry.sourceReference.startsWith("inv_")) return `/finance/ar/invoices/${entry.sourceReference}`;
    if (entry.sourceReference.startsWith("bill_")) return `/finance/ap/bills/${entry.sourceReference}`;
    return null;
}

const sourceLabels: Record<JournalEntryResponse["source"], string> = {
    MANUAL: "Manual",
    SYSTEM: "System",
};

export function JournalSummaryCard({ entry }: { entry: JournalEntryResponse }) {
    const href = sourceHref(entry);
    return (
        <Card className="p-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4">
                <Field label="Entry date">{formatDateLong(entry.date)}</Field>
                <Field label="Source">{sourceLabels[entry.source]}</Field>
                <Field label="Source reference">
                    {entry.sourceReference ? (
                        href ? (
                            <Link href={href} className="font-mono text-[12px] tracking-[0.02em] hover:text-(--accent)">
                                {entry.sourceReference}
                            </Link>
                        ) : (
                            <span className="font-mono text-[12px] tracking-[0.02em]">{entry.sourceReference}</span>
                        )
                    ) : (
                        "—"
                    )}
                </Field>
                <Field label="Created by">{entry.createdBy}</Field>
                {entry.postedAt && <Field label="Posted">{formatDateLong(entry.postedAt)}</Field>}
                {entry.voidedAt && <Field label="Voided">{formatDateLong(entry.voidedAt)}</Field>}
            </div>
            {entry.voidReason && (
                <div className="mt-6 rounded-lg border border-(--accent-soft) bg-(--accent-soft) px-4 py-3">
                    <div className="font-mono text-[10px] tracking-[0.16em] text-(--accent-deep) uppercase">
                        Void reason
                    </div>
                    <div className="mt-1 text-[13px] text-(--ink-soft)">{entry.voidReason}</div>
                </div>
            )}
        </Card>
    );
}
