import type { DepreciationRunStatus } from "@/lib/api/assets/depreciation";

const TONES: Record<DepreciationRunStatus, string> = {
    DRAFT: "bg-(--paper-3) text-(--ink-soft)",
    POSTED: "bg-(--moss) text-(--paper)",
    CANCELLED: "bg-(--paper-3) text-(--muted)",
};

const LABELS: Record<DepreciationRunStatus, string> = {
    DRAFT: "Draft",
    POSTED: "Posted",
    CANCELLED: "Cancelled",
};

export const DepreciationStatusBadge = ({ status }: { status: DepreciationRunStatus }) => (
    <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase ${TONES[status]}`}>
        {LABELS[status]}
    </span>
);
