import type { AssetStatus } from "@/lib/api/assets/assets";

const TONES: Record<AssetStatus, string> = {
    ACTIVE: "bg-(--moss) text-(--paper)",
    DISPOSED: "bg-(--paper-3) text-(--muted)",
    FULLY_DEPRECIATED: "bg-(--ochre) text-(--ink)",
};

const LABELS: Record<AssetStatus, string> = {
    ACTIVE: "Active",
    DISPOSED: "Disposed",
    FULLY_DEPRECIATED: "Fully depreciated",
};

export const AssetStatusBadge = ({ status }: { status: AssetStatus }) => (
    <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase ${TONES[status]}`}>
        {LABELS[status]}
    </span>
);
