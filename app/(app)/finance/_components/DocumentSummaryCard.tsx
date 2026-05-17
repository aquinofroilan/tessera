import { ReactNode } from "react";

import { format, parseISO } from "date-fns"
import Link from "next/link";

import { Card, CardEyebrow } from "@/components/ui";
import type { Money } from "@/lib/api/types";
import { formatMoney } from "../_data/format";

function formatDateLong(iso: string) {
    return format(parseISO(iso), "MMM d, yyyy");
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <CardEyebrow>{label}</CardEyebrow>
            <div className="text-[14px] text-foreground tabular-nums">{children}</div>
        </div>
    );
}

export type DocumentSummary = {
    partyLabel: string;
    partyName: string;
    partyHref?: string;
    referenceNumber: string | null;
    date: string;
    dueDate: string;
    totalAmount: Money;
    taxAmount: Money;
    settledLabel: string;
    settledAmount: Money;
    outstanding: Money;
    currencyCode: string;
    createdBy: string;
    approvedAt: string | null;
    approvedBy: string | null;
    settledOn: { label: string; value: string | null };
    voidedAt: string | null;
    voidedBy: string | null;
    voidReason: string | null;
};

export function DocumentSummaryCard({ summary }: { summary: DocumentSummary }) {
    return (
        <Card className="p-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4">
                <Field label={summary.partyLabel}>
                    {summary.partyHref ? (
                        <Link href={summary.partyHref} className="hover:text-(--accent)">
                            {summary.partyName}
                        </Link>
                    ) : (
                        summary.partyName
                    )}
                </Field>
                <Field label="Reference">{summary.referenceNumber ?? "—"}</Field>
                <Field label="Issued">{formatDateLong(summary.date)}</Field>
                <Field label="Due">{formatDateLong(summary.dueDate)}</Field>
                <Field label="Total">{formatMoney(summary.totalAmount, summary.currencyCode)}</Field>
                <Field label="Tax">{formatMoney(summary.taxAmount, summary.currencyCode)}</Field>
                <Field label={summary.settledLabel}>{formatMoney(summary.settledAmount, summary.currencyCode)}</Field>
                <Field label="Outstanding">
                    <span className="font-display text-[18px] font-[380] tracking-[-0.01em] text-(--accent)">
                        {formatMoney(summary.outstanding, summary.currencyCode)}
                    </span>
                </Field>
                <Field label="Created by">{summary.createdBy}</Field>
                {summary.approvedAt && (
                    <Field label="Approved">
                        {formatDateLong(summary.approvedAt)} · {summary.approvedBy}
                    </Field>
                )}
                {summary.settledOn.value && (
                    <Field label={summary.settledOn.label}>{formatDateLong(summary.settledOn.value)}</Field>
                )}
                {summary.voidedAt && (
                    <Field label="Voided">
                        {formatDateLong(summary.voidedAt)} · {summary.voidedBy}
                    </Field>
                )}
            </div>
            {summary.voidReason && (
                <div className="mt-6 rounded-lg border border-(--accent-soft) bg-(--accent-soft) px-4 py-3">
                    <div className="font-mono text-[10px] tracking-[0.16em] text-(--accent-deep) uppercase">
                        Void reason
                    </div>
                    <div className="mt-1 text-[13px] text-(--ink-soft)">{summary.voidReason}</div>
                </div>
            )}
        </Card>
    );
}
