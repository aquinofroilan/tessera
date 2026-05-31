import type { MovementType } from "@/lib/api/inventory/movements";
import { movementTypeLabel } from "../_data/movements-query";

const STYLES: Record<MovementType, string> = {
    RECEIPT: "bg-(--moss-soft) text-(--moss)",
    ISSUE: "bg-(--accent)/15 text-(--accent)",
    TRANSFER: "bg-(--paper-3) text-(--ink-soft)",
    ADJUSTMENT_IN: "bg-(--moss-soft)/60 text-(--moss)",
    ADJUSTMENT_OUT: "bg-(--accent)/10 text-(--accent)",
};

export const MovementTypeBadge = ({ type }: { type: MovementType }) => (
    <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase ${STYLES[type]}`}>
        {movementTypeLabel(type)}
    </span>
);
