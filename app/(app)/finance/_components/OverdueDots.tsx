import { cn } from "@/lib/utils";

export function OverdueCell({ daysOverdue }: { daysOverdue: number }) {
    if (daysOverdue < 0) {
        return (
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-(--accent-deep)">
                <span className="size-1.5 rounded-full bg-(--accent)" />
                {Math.abs(daysOverdue)}d overdue
            </span>
        );
    }
    if (daysOverdue <= 3) {
        return (
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-(--ochre)">
                <span className="size-1.5 rounded-full bg-(--ochre)" />
                Due in {daysOverdue}d
            </span>
        );
    }
    return (
        <span className={cn("inline-flex items-center gap-1.5 font-mono text-[11px] text-(--muted)")}>
            <span className="size-1.5 rounded-full bg-(--muted-2)" />
            Due in {daysOverdue}d
        </span>
    );
}
