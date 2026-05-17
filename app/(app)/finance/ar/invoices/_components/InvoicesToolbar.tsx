"use client";

import { StatusToolbar, type StatusToolbarTab } from "../../../_components/StatusToolbar";
import type { InvoiceStatus } from "@/lib/api/finance/invoices";
import type { StatusCounts, StatusFilter } from "../_data/filter";

const tabs: StatusToolbarTab<InvoiceStatus>[] = [
    { value: "ALL", label: "All" },
    { value: "DRAFT", label: "Draft" },
    { value: "APPROVED", label: "Approved" },
    { value: "PARTIALLY_PAID", label: "Part-paid" },
    { value: "PAID", label: "Paid" },
    { value: "VOID", label: "Voided" },
];

type ToolbarProps = {
    activeStatus: StatusFilter;
    initialQ: string;
    counts: StatusCounts;
};

export function InvoicesToolbar({ activeStatus, initialQ, counts }: ToolbarProps) {
    return (
        <StatusToolbar
            tabs={tabs}
            activeStatus={activeStatus}
            initialQ={initialQ}
            counts={counts}
            searchPlaceholder="Search number, customer, or reference…"
            searchAriaLabel="Search invoices"
        />
    );
}
