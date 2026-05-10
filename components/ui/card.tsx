import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "bg-card text-foreground rounded-(--radius) flex flex-col border border-(--rule) shadow-[0_1px_0_rgb(23_22_15/2%),0_18px_36px_-18px_rgb(23_22_15/8%)]",
                className,
            )}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("flex flex-col gap-1 px-5 pt-5 pb-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn("font-display text-foreground text-lg font-[380] tracking-[-0.01em]", className)}
            {...props}
        />
    );
}

export function CardEyebrow({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn("font-mono text-[10px] tracking-[0.16em] text-(--muted) uppercase", className)}
            {...props}
        />
    );
}

export function CardDescription({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("text-sm text-(--ink-soft)", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("px-5 pb-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn("flex items-center gap-3 border-t border-(--rule-soft) px-5 py-3", className)}
            {...props}
        />
    );
}
