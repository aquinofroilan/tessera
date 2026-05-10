"use client";

import type { ComponentProps } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { IconCheck } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                "peer border-border bg-card relative grid size-4.5 shrink-0 place-items-center rounded-[5px] border-[1.5px] transition-colors outline-none",
                "hover:border-(--muted-2)",
                "focus-visible:border-foreground focus-visible:ring-3 focus-visible:ring-[rgb(23_22_15/15%)]",
                "data-checked:border-foreground data-checked:bg-foreground data-checked:text-background",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "aria-invalid:border-(--accent)",
                className,
            )}
            {...props}>
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="grid place-content-center text-current transition-none [&>svg]:size-3">
                <IconCheck stroke={2.5} />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { Checkbox };
