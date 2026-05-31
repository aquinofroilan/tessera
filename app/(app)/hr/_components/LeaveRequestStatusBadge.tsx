import { cn } from "@/lib/utils";
import type { LeaveRequestStatus } from "@/lib/api/hr/leave-requests";

const STYLES: Record<LeaveRequestStatus, string> = {
    PENDING: "bg-(--paper-2) text-(--ink-soft)",
    APPROVED: "bg-(--accent)/15 text-(--accent)",
    REJECTED: "bg-(--rule) text-(--muted)",
    CANCELLED: "bg-(--rule) text-(--muted)",
};

const LABELS: Record<LeaveRequestStatus, string> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
};

export const LeaveRequestStatusBadge = ({ status }: { status: LeaveRequestStatus }) => (
    <span
        className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase",
            STYLES[status],
        )}>
        {LABELS[status]}
    </span>
);
