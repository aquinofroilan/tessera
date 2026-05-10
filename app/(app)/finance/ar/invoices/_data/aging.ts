import { differenceInCalendarDays, parseISO } from "date-fns";

import type { AgingBucket, InvoiceResponse } from "@/lib/api/finance/invoices";

const ZERO_BUCKET: AgingBucket = {
    current: "0.00",
    days1to30: "0.00",
    days31to60: "0.00",
    days61to90: "0.00",
    days90plus: "0.00",
    total: "0.00",
};

function add(a: string, b: number) {
    return (Number(a) + b).toFixed(2);
}

function bucketKey(daysOverdue: number): keyof Omit<AgingBucket, "total"> {
    if (daysOverdue <= 0) return "current";
    if (daysOverdue <= 30) return "days1to30";
    if (daysOverdue <= 60) return "days31to60";
    if (daysOverdue <= 90) return "days61to90";
    return "days90plus";
}

function isOpen(status: InvoiceResponse["status"]) {
    return status === "APPROVED" || status === "PARTIALLY_PAID";
}

export type AgingSummary = {
    asOfDate: string;
    bucket: AgingBucket;
    counts: Record<keyof Omit<AgingBucket, "total">, number> & { total: number };
};

export function deriveAgingSummary(invoices: InvoiceResponse[], asOfDate: string): AgingSummary {
    const asOf = parseISO(asOfDate);
    const bucket: AgingBucket = { ...ZERO_BUCKET };
    const counts = {
        current: 0,
        days1to30: 0,
        days31to60: 0,
        days61to90: 0,
        days90plus: 0,
        total: 0,
    };

    for (const inv of invoices) {
        if (!isOpen(inv.status)) continue;
        const outstanding = Number(inv.totalAmount) - Number(inv.amountReceived);
        if (outstanding <= 0) continue;
        const days = differenceInCalendarDays(asOf, parseISO(inv.dueDate));
        const key = bucketKey(days);
        bucket[key] = add(bucket[key], outstanding);
        bucket.total = add(bucket.total, outstanding);
        counts[key] += 1;
        counts.total += 1;
    }

    return { asOfDate, bucket, counts };
}
