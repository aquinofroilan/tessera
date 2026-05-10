import { format, parseISO } from "date-fns";

import { Card, CardEyebrow } from "@/components/ui";
import type { BillResponse } from "@/lib/api/finance/bills";
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

export function BillSummaryCard({ bill }: { bill: BillResponse }) {
    const outstanding = (Number(bill.totalAmount) - Number(bill.amountPaid)).toFixed(2);
    return (
        <Card className="p-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4">
                <Field label="Vendor">{bill.vendorName}</Field>
                <Field label="Reference">{bill.referenceNumber ?? "—"}</Field>
                <Field label="Issued">{formatDateLong(bill.date)}</Field>
                <Field label="Due">{formatDateLong(bill.dueDate)}</Field>
                <Field label="Total">{formatMoney(bill.totalAmount, bill.currencyCode)}</Field>
                <Field label="Tax">{formatMoney(bill.taxAmount, bill.currencyCode)}</Field>
                <Field label="Paid">{formatMoney(bill.amountPaid, bill.currencyCode)}</Field>
                <Field label="Outstanding">
                    <span className="font-display text-[18px] font-[380] tracking-[-0.01em] text-(--accent)">
                        {formatMoney(outstanding, bill.currencyCode)}
                    </span>
                </Field>
                <Field label="Created by">{bill.createdBy}</Field>
                {bill.approvedAt && (
                    <Field label="Approved">
                        {formatDateLong(bill.approvedAt)} · {bill.approvedBy}
                    </Field>
                )}
                {bill.paidAt && <Field label="Paid on">{formatDateLong(bill.paidAt)}</Field>}
                {bill.voidedAt && (
                    <Field label="Voided">
                        {formatDateLong(bill.voidedAt)} · {bill.voidedBy}
                    </Field>
                )}
            </div>
            {bill.voidReason && (
                <div className="mt-6 rounded-lg border border-(--accent-soft) bg-(--accent-soft) px-4 py-3">
                    <div className="font-mono text-[10px] tracking-[0.16em] text-(--accent-deep) uppercase">
                        Void reason
                    </div>
                    <div className="mt-1 text-[13px] text-(--ink-soft)">{bill.voidReason}</div>
                </div>
            )}
        </Card>
    );
}
