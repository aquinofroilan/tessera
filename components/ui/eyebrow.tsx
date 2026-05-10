import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type EyebrowProps = ComponentProps<"div"> & {
    tag?: ReactNode;
    tagTone?: "moss" | "paper" | "accent";
};

const tagToneClass: Record<NonNullable<EyebrowProps["tagTone"]>, string> = {
    moss: "bg-(--moss-soft) text-(--moss)",
    paper: "bg-(--paper-3) text-(--ink-soft)",
    accent: "bg-(--accent) text-(--paper)",
};

function Eyebrow({ className, children, tag, tagTone = "moss", ...props }: EyebrowProps) {
    return (
        <div
            data-slot="eyebrow"
            className={cn(
                "inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.14em] text-(--ink-soft) uppercase",
                className,
            )}
            {...props}>
            <span>{children}</span>
            {tag ? (
                <span
                    className={cn("rounded-full px-2.5 py-0.75 text-[10px] tracking-widest", tagToneClass[tagTone])}>
                    {tag}
                </span>
            ) : null}
        </div>
    );
}

export { Eyebrow, type EyebrowProps };
