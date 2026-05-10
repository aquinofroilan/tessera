import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "w-full min-w-0 rounded-[10px] border border-[var(--rule)] bg-[var(--card)] px-3.5 py-3 text-[14.5px] text-[var(--ink)] transition-colors outline-none",
                "placeholder:text-[var(--muted-2)]",
                "hover:border-[var(--muted-2)]",
                "focus:border-[var(--ink)] focus:shadow-[0_0_0_3px_rgb(23_22_15_/_6%)]",
                "disabled:cursor-not-allowed disabled:opacity-70",
                "aria-invalid:border-[var(--accent)] aria-invalid:shadow-[0_0_0_3px_rgb(185_58_29_/_10%)]",
                className,
            )}
            {...props}
        />
    );
}

export { Input };
