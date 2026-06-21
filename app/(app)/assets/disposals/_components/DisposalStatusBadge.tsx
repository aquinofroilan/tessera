import type { DisposalStatus, DisposalType } from "@/lib/api/assets/disposals";

const STATUS_TONES: Record<DisposalStatus, string> = {
    DRAFT: "bg-(--paper-3) text-(--ink-soft)",
    POSTED: "bg-(--moss) text-(--paper)",
    CANCELLED: "bg-(--paper-3) text-(--muted)",
};

const STATUS_LABELS: Record<DisposalStatus, string> = {
    DRAFT: "Draft",
    POSTED: "Posted",
    CANCELLED: "Cancelled",
};

const TYPE_LABELS: Record<DisposalType, string> = {
    SALE: "Sale",
    WRITE_OFF: "Write-off",
    SCRAP: "Scrap",
};

export const DisposalStatusBadge = ({ status }: { status: DisposalStatus }) => (
    <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase ${STATUS_TONES[status]}`}>
        {STATUS_LABELS[status]}
    </span>
);

export const DisposalTypeLabel = ({ type }: { type: DisposalType }) => (
    <span className="font-mono text-[11px] tracking-[0.04em] text-(--ink-soft) uppercase">
        {TYPE_LABELS[type]}
    </span>
);
