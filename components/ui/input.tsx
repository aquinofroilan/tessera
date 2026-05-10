import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "border-border bg-card text-foreground w-full min-w-0 rounded-[10px] border px-3.5 py-3 text-[14.5px] transition-colors outline-none",
                "placeholder:text-(--muted-2)",
                "hover:border-(--muted-2)",
                "focus:border-foreground focus:shadow-[0_0_0_3px_rgb(23_22_15/6%)]",
                "disabled:cursor-not-allowed disabled:opacity-70",
                "aria-invalid:border-(--accent) aria-invalid:shadow-[0_0_0_3px_rgb(185_58_29/10%)]",
                className,
            )}
            {...props}
        />
    );
}

export { Input };
