import { differenceInCalendarDays, parseISO } from "date-fns";

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

export type AgingSummary = {
    asOfDate: string;
    bucket: AgingBucket;
    counts: Record<keyof Omit<AgingBucket, "total">, number> & { total: number };
};

export type AgingItem = {
    isOpen: boolean;
    outstanding: number;
    dueDate: string;
};

export function deriveAgingSummary(items: AgingItem[], asOfDate: string): AgingSummary {
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

    for (const item of items) {
        if (!item.isOpen) continue;
        if (item.outstanding <= 0) continue;
        const days = differenceInCalendarDays(asOf, parseISO(item.dueDate));
        const key = bucketKey(days);
        bucket[key] = add(bucket[key], item.outstanding);
        bucket.total = add(bucket.total, item.outstanding);
        counts[key] += 1;
        counts.total += 1;
    }

    return { asOfDate, bucket, counts };
}
