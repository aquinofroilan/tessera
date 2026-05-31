import type { EmploymentStatus } from "@/lib/api/hr/employees";
import { StatusBadge } from "./StatusBadge";

const STYLES: Record<EmploymentStatus, string> = {
    ACTIVE: "bg-(--accent)/15 text-(--accent)",
    ON_LEAVE: "bg-(--paper-2) text-(--ink-soft)",
    TERMINATED: "bg-(--rule) text-(--muted)",
};

const LABELS: Record<EmploymentStatus, string> = {
    ACTIVE: "Active",
    ON_LEAVE: "On leave",
    TERMINATED: "Terminated",
};

export const EmployeeStatusBadge = ({ status }: { status: EmploymentStatus }) => (
    <StatusBadge status={status} styles={STYLES} labels={LABELS} />
);
