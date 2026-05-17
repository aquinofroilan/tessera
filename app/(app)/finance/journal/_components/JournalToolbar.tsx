"use client";

import type { JournalEntryStatus } from "@/lib/api/finance/journal";
import { StatusToolbar, type StatusToolbarTab } from "../../_components/StatusToolbar";
import type { StatusCounts, StatusFilter } from "../_data/filter";

const tabs: StatusToolbarTab<JournalEntryStatus>[] = [
    { value: "ALL", label: "All" },
    { value: "DRAFT", label: "Draft" },
    { value: "POSTED", label: "Posted" },
    { value: "VOIDED", label: "Voided" },
];

type ToolbarProps = {
    activeStatus: StatusFilter;
    initialQ: string;
    counts: StatusCounts;
};

export function JournalToolbar({ activeStatus, initialQ, counts }: ToolbarProps) {
    return (
        <StatusToolbar
            tabs={tabs}
            activeStatus={activeStatus}
            initialQ={initialQ}
            counts={counts}
            searchPlaceholder="Search entry number, description, or source…"
            searchAriaLabel="Search journal entries"
        />
    );
}
