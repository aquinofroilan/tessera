import { cn } from "@/lib/utils";

type FormDividerProps = {
    label: string;
    className?: string;
};

export function FormDivider({ label, className }: FormDividerProps) {
    return (
        <div
            className={cn(
                "my-1 flex items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-[var(--muted)] uppercase",
                "before:h-px before:flex-1 before:bg-[var(--rule)] before:content-['']",
                "after:h-px after:flex-1 after:bg-[var(--rule)] after:content-['']",
                className,
            )}>
            {label}
        </div>
    );
}
