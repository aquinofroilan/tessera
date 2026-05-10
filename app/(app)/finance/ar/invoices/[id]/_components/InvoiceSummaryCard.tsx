import { format, parseISO } from "date-fns";

import { Card, CardEyebrow } from "@/components/ui";
import type { InvoiceResponse } from "@/lib/api/finance/invoices";
import { formatMoney } from "../../../../_data/format";

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

export function InvoiceSummaryCard({ invoice }: { invoice: InvoiceResponse }) {
    const outstanding = (Number(invoice.totalAmount) - Number(invoice.amountReceived)).toFixed(2);
    return (
        <Card className="p-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4">
                <Field label="Customer">{invoice.customerName}</Field>
                <Field label="Reference">{invoice.referenceNumber ?? "—"}</Field>
                <Field label="Issued">{formatDateLong(invoice.date)}</Field>
                <Field label="Due">{formatDateLong(invoice.dueDate)}</Field>
                <Field label="Total">{formatMoney(invoice.totalAmount, invoice.currencyCode)}</Field>
                <Field label="Tax">{formatMoney(invoice.taxAmount, invoice.currencyCode)}</Field>
                <Field label="Received">{formatMoney(invoice.amountReceived, invoice.currencyCode)}</Field>
                <Field label="Outstanding">
                    <span className="font-display text-[18px] font-[380] tracking-[-0.01em] text-(--accent)">
                        {formatMoney(outstanding, invoice.currencyCode)}
                    </span>
                </Field>
                <Field label="Created by">{invoice.createdBy}</Field>
                {invoice.approvedAt && (
                    <Field label="Approved">
                        {formatDateLong(invoice.approvedAt)} · {invoice.approvedBy}
                    </Field>
                )}
                {invoice.paidAt && <Field label="Paid">{formatDateLong(invoice.paidAt)}</Field>}
                {invoice.voidedAt && (
                    <Field label="Voided">
                        {formatDateLong(invoice.voidedAt)} · {invoice.voidedBy}
                    </Field>
                )}
            </div>
            {invoice.voidReason && (
                <div className="mt-6 rounded-lg border border-(--accent-soft) bg-(--accent-soft) px-4 py-3">
                    <div className="font-mono text-[10px] tracking-[0.16em] text-(--accent-deep) uppercase">
                        Void reason
                    </div>
                    <div className="mt-1 text-[13px] text-(--ink-soft)">{invoice.voidReason}</div>
                </div>
            )}
        </Card>
    );
}
