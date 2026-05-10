import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    "rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 active:not-aria-[haspopup]:translate-y-px",
                outline:
                    "rounded-lg border-border bg-background hover:bg-muted hover:text-foreground active:not-aria-[haspopup]:translate-y-px",
                secondary:
                    "rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 active:not-aria-[haspopup]:translate-y-px",
                ghost: "rounded-lg hover:bg-muted hover:text-foreground active:not-aria-[haspopup]:translate-y-px",
                destructive:
                    "rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 active:not-aria-[haspopup]:translate-y-px",
                link: "text-primary underline-offset-4 hover:underline",
                pill: "rounded-full bg-foreground text-background tracking-[-0.005em] hover:-translate-y-px hover:bg-(--accent)",
                "pill-outline":
                    "rounded-full border-(--ink) bg-transparent text-foreground hover:-translate-y-px hover:bg-foreground hover:text-background",
                "pill-ghost": "rounded-full bg-transparent text-(--ink-soft) hover:border-border hover:bg-(--paper-2)",
                "pill-success": "rounded-full bg-(--moss) text-background hover:-translate-y-px",
                sso: "rounded-[10px] border-border bg-card text-foreground hover:-translate-y-px hover:border-(--ink)",
            },
            size: {
                default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
                xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg",
                sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem]",
                lg: "h-9 gap-1.5 px-2.5",
                icon: "size-8",
                "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] [&_svg:not([class*='size-'])]:size-3",
                "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)]",
                "icon-lg": "size-9",
                pill: "gap-2 px-4.5 py-2.5 text-sm",
                "pill-lg": "gap-2.5 px-5 py-3.5 text-[15px]",
                sso: "gap-2.5 px-3.5 py-[11px] text-sm [&_svg:not([class*='size-'])]:size-4.5",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function Button({
    className,
    variant = "default",
    size = "default",
    asChild = false,
    ...props
}: ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot.Root : "button";

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
