import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Input, type InputProps } from "@/components/ui/input";

type IconInputProps = InputProps & {
    startIcon?: ReactNode;
    endAdornment?: ReactNode;
};

const iconOffsetByTone = {
    default: { left: "left-3.5", padLeft: "pl-10", padRight: "pr-11", right: "right-2.5" },
    compact: { left: "left-3", padLeft: "pl-8", padRight: "pr-9", right: "right-2" },
} as const;

function IconInput({ className, startIcon, endAdornment, tone = "default", ...props }: IconInputProps) {
    const offsets = iconOffsetByTone[tone ?? "default"];
    return (
        <div data-slot="icon-input" className="relative">
            {startIcon ? (
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none absolute top-1/2 grid -translate-y-1/2 place-items-center text-(--muted)",
                        offsets.left,
                    )}>
                    {startIcon}
                </span>
            ) : null}
            <Input
                tone={tone}
                className={cn(startIcon && offsets.padLeft, endAdornment && offsets.padRight, className)}
                {...props}
            />
            {endAdornment ? (
                <span data-slot="icon-input-end" className={cn("absolute top-1/2 -translate-y-1/2", offsets.right)}>
                    {endAdornment}
                </span>
            ) : null}
        </div>
    );
}

export { IconInput, type IconInputProps };
