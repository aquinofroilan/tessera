import { differenceInCalendarDays, parseISO } from "date-fns";

import type { BillResponse } from "@/lib/api/finance/bills";
import type { AgingBucket } from "@/lib/api/finance/invoices";

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

function isOpen(status: BillResponse["status"]) {
    return status === "APPROVED" || status === "PARTIALLY_PAID";
}

export type ApAgingSummary = {
    asOfDate: string;
    bucket: AgingBucket;
    counts: Record<keyof Omit<AgingBucket, "total">, number> & { total: number };
};

export function deriveApAgingSummary(bills: BillResponse[], asOfDate: string): ApAgingSummary {
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

    for (const bill of bills) {
        if (!isOpen(bill.status)) continue;
        const outstanding = Number(bill.totalAmount) - Number(bill.amountPaid);
        if (outstanding <= 0) continue;
        const days = differenceInCalendarDays(asOf, parseISO(bill.dueDate));
        const key = bucketKey(days);
        bucket[key] = add(bucket[key], outstanding);
        bucket.total = add(bucket.total, outstanding);
        counts[key] += 1;
        counts.total += 1;
    }

    return { asOfDate, bucket, counts };
}
