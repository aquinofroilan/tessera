"use client";

import type { ComponentProps } from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
    "select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "flex items-center gap-2 text-sm leading-none font-medium",
                eyebrow: "block font-mono text-[10px] uppercase tracking-[0.12em] text-(--muted)",
            },
        },
        defaultVariants: { variant: "default" },
    },
);

function Label({
    className,
    variant,
    ...props
}: ComponentProps<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>) {
    return <LabelPrimitive.Root data-slot="label" className={cn(labelVariants({ variant, className }))} {...props} />;
}

export { Label, labelVariants };
