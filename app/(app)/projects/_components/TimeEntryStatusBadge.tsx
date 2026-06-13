import type { TimeEntryStatus } from "@/lib/api/projects/time-entries";
import { StatusBadge } from "../../hr/_components/StatusBadge";

const STYLES: Record<TimeEntryStatus, string> = {
    DRAFT: "bg-(--paper-2) text-(--ink-soft)",
    SUBMITTED: "bg-(--paper-2) text-(--ink)",
    APPROVED: "bg-(--accent)/15 text-(--accent)",
    REJECTED: "bg-(--rule) text-(--muted)",
};

const LABELS: Record<TimeEntryStatus, string> = {
    DRAFT: "Draft",
    SUBMITTED: "Submitted",
    APPROVED: "Approved",
    REJECTED: "Rejected",
};

export const TimeEntryStatusBadge = ({ status }: { status: TimeEntryStatus }) => (
    <StatusBadge status={status} styles={STYLES} labels={LABELS} />
);
