import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: ComponentProps<"table">) {
    return (
        <div className="w-full overflow-x-auto">
            <table className={cn("w-full caption-bottom border-collapse text-sm", className)} {...props} />
        </div>
    );
}

export function TableHeader({ className, ...props }: ComponentProps<"thead">) {
    return <thead className={cn("border-b border-(--rule)", className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentProps<"tbody">) {
    return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }: ComponentProps<"tr">) {
    return (
        <tr
            className={cn(
                "border-b border-(--rule-soft) transition-colors hover:bg-(--paper-2)/60 data-[state=selected]:bg-(--paper-2)",
                className,
            )}
            {...props}
        />
    );
}

export function TableHead({ className, ...props }: ComponentProps<"th">) {
    return (
        <th
            className={cn(
                "h-9 px-4 text-left align-middle font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase",
                className,
            )}
            {...props}
        />
    );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
    return (
        <td className={cn("h-12 px-4 align-middle text-(--ink) tabular-nums", className)} {...props} />
    );
}

export function TableCaption({ className, ...props }: ComponentProps<"caption">) {
    return <caption className={cn("mt-3 text-sm text-(--muted)", className)} {...props} />;
}
