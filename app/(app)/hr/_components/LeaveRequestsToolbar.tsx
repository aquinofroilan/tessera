"use client";

import type { LeaveRequestStatus } from "@/lib/api/hr/leave-requests";
import { StatusToolbar, type StatusToolbarTab } from "../../finance/_components/StatusToolbar";

type Props = {
    activeStatus: LeaveRequestStatus | "ALL";
    initialQ: string;
    counts: Record<LeaveRequestStatus | "ALL", number>;
};

const tabs: StatusToolbarTab<LeaveRequestStatus>[] = [
    { value: "ALL", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
    { value: "CANCELLED", label: "Cancelled" },
];

export const LeaveRequestsToolbar = ({ activeStatus, initialQ, counts }: Props) => (
    <StatusToolbar
        tabs={tabs}
        activeStatus={activeStatus}
        initialQ={initialQ}
        counts={counts}
        searchPlaceholder="Search employee, type, reason…"
        searchAriaLabel="Search leave requests"
        tabsAriaLabel="Filter by status"
        paramKey="status"
    />
);
