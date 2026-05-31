import { cn } from "@/lib/utils";
import type { EmploymentStatus } from "@/lib/api/hr/employees";

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

type Props = { status: EmploymentStatus };

export const EmployeeStatusBadge = ({ status }: Props) => (
    <span
        className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase",
            STYLES[status],
        )}>
        {LABELS[status]}
    </span>
);
