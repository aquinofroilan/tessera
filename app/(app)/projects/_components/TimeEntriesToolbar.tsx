"use client";

import type { TimeEntryStatus } from "@/lib/api/projects/time-entries";
import { StatusToolbar, type StatusToolbarTab } from "../../finance/_components/StatusToolbar";

type Props = {
    activeStatus: TimeEntryStatus | "ALL";
    initialQ: string;
    counts: Record<TimeEntryStatus | "ALL", number>;
};

const tabs: StatusToolbarTab<TimeEntryStatus>[] = [
    { value: "ALL", label: "All" },
    { value: "DRAFT", label: "Draft" },
    { value: "SUBMITTED", label: "Submitted" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
];

export const TimeEntriesToolbar = ({ activeStatus, initialQ, counts }: Props) => (
    <StatusToolbar
        tabs={tabs}
        activeStatus={activeStatus}
        initialQ={initialQ}
        counts={counts}
        searchPlaceholder="Search employee, project, notes…"
        searchAriaLabel="Search time entries"
        tabsAriaLabel="Filter by status"
        paramKey="status"
    />
);
