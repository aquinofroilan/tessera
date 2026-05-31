import { cn } from "@/lib/utils";
import type { PayrollRunStatus } from "@/lib/api/hr/payroll-runs";

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
    <span
        className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase",
            STYLES[status],
        )}>
        {LABELS[status]}
    </span>
);
