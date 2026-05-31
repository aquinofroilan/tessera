import type { PayrollRunStatus } from "@/lib/api/hr/payroll-runs";
import { StatusBadge } from "./StatusBadge";

const STYLES: Record<PayrollRunStatus, string> = {
    DRAFT: "bg-(--paper-2) text-(--ink-soft)",
    APPROVED: "bg-(--accent)/15 text-(--accent)",
    PAID: "bg-(--accent)/25 text-(--accent)",
    CANCELLED: "bg-(--rule) text-(--muted)",
};

const LABELS: Record<PayrollRunStatus, string> = {
    DRAFT: "Draft",
    APPROVED: "Approved",
    PAID: "Paid",
    CANCELLED: "Cancelled",
};

export const PayrollRunStatusBadge = ({ status }: { status: PayrollRunStatus }) => (
    <StatusBadge status={status} styles={STYLES} labels={LABELS} />
);
