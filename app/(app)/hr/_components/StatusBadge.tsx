import { cn } from "@/lib/utils";

type Props<S extends string> = {
    status: S;
    styles: Record<S, string>;
    labels: Record<S, string>;
};

export const StatusBadge = <S extends string>({ status, styles, labels }: Props<S>) => (
    <span
        className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase",
            styles[status],
        )}>
        {labels[status]}
    </span>
);
