import type { ItemStatus } from "@/lib/api/inventory/items";

const STYLES: Record<ItemStatus, string> = {
    ACTIVE: "bg-(--moss-soft) text-(--moss)",
    ARCHIVED: "bg-(--paper-3) text-(--muted)",
};

const LABELS: Record<ItemStatus, string> = {
    ACTIVE: "Active",
    ARCHIVED: "Archived",
};

export const InventoryStatusBadge = ({ status }: { status: ItemStatus }) => (
    <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase ${STYLES[status]}`}>
        {LABELS[status]}
    </span>
);
