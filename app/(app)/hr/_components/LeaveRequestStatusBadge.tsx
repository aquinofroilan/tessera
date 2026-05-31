import type { LeaveRequestStatus } from "@/lib/api/hr/leave-requests";
import { StatusBadge } from "./StatusBadge";

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
    <StatusBadge status={status} styles={STYLES} labels={LABELS} />
);
