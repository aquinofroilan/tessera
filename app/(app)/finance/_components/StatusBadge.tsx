import { cn } from "@/lib/utils";

const tones = {
    DRAFT: "bg-(--paper-2) text-(--ink-soft)",
    APPROVED: "bg-(--paper-2) text-(--ink)",
    PARTIALLY_PAID: "bg-(--moss-soft) text-(--moss)",
    PAID: "bg-(--moss-soft) text-(--moss)",
    POSTED: "bg-(--moss-soft) text-(--moss)",
    VOID: "bg-(--paper-3) text-(--muted)",
    VOIDED: "bg-(--paper-3) text-(--muted)",
} as const;

type StatusKey = keyof typeof tones;

const labels: Record<StatusKey, string> = {
    DRAFT: "Draft",
    APPROVED: "Approved",
    PARTIALLY_PAID: "Part-paid",
    PAID: "Paid",
    POSTED: "Posted",
    VOID: "Void",
    VOIDED: "Voided",
};

export function StatusBadge({ status, className }: { status: StatusKey; className?: string }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase",
                tones[status],
                className,
            )}>
            {labels[status]}
        </span>
    );
}
