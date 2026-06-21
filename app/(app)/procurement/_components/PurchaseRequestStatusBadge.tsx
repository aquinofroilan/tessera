import type { PurchaseRequestStatus } from "@/lib/api/procurement/purchase-requests";

const TONES: Record<PurchaseRequestStatus, string> = {
    DRAFT: "bg-(--paper-3) text-(--ink-soft)",
    SUBMITTED: "bg-(--sky) text-(--paper)",
    APPROVED: "bg-(--moss) text-(--paper)",
    REJECTED: "bg-(--accent) text-(--paper)",
    CONVERTED: "bg-(--ink) text-(--paper)",
    CANCELLED: "bg-(--paper-3) text-(--muted)",
};

const LABELS: Record<PurchaseRequestStatus, string> = {
    DRAFT: "Draft",
    SUBMITTED: "Submitted",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    CONVERTED: "Converted to PO",
    CANCELLED: "Cancelled",
};

export const PurchaseRequestStatusBadge = ({ status }: { status: PurchaseRequestStatus }) => (
    <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase ${TONES[status]}`}>
        {LABELS[status]}
    </span>
);
