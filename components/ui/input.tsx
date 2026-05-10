import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const inputVariants = cva(
    "w-full min-w-0 border transition-colors outline-none placeholder:text-(--muted-2) hover:border-(--muted-2) disabled:cursor-not-allowed disabled:opacity-70 aria-invalid:border-(--accent) aria-invalid:shadow-[0_0_0_3px_rgb(185_58_29/10%)]",
    {
        variants: {
            tone: {
                default:
                    "rounded-[10px] border-border bg-card px-3.5 py-3 text-[14.5px] text-foreground focus:border-foreground focus:shadow-[0_0_0_3px_rgb(23_22_15/6%)]",
                compact:
                    "rounded-lg border-(--rule) bg-(--paper-2) px-3 py-1.75 text-sm text-(--ink) focus:border-(--ink) focus:bg-(--card)",
            },
        },
        defaultVariants: { tone: "default" },
    },
);

type InputProps = ComponentProps<"input"> & VariantProps<typeof inputVariants>;

function Input({ className, type, tone, ...props }: InputProps) {
    return <input type={type} data-slot="input" className={cn(inputVariants({ tone, className }))} {...props} />;
}

export { Input, inputVariants, type InputProps };
