import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthCalloutProps = {
    icon: ReactNode;
    title: string;
    children: ReactNode;
    className?: string;
};

export function AuthCallout({ icon, title, children, className }: AuthCalloutProps) {
    return (
        <div
            className={cn(
                "border-border mt-6 flex items-start gap-3 rounded-[10px] border border-dashed bg-(--paper-2) px-4 py-3.5 text-[13px] leading-normal text-(--ink-soft)",
                className,
            )}>
            <div className="bg-foreground text-background grid size-7.5 flex-none place-items-center rounded-md">
                {icon}
            </div>
            <div>
                <strong className="text-foreground font-medium">{title}</strong>
                <br />
                {children}
            </div>
        </div>
    );
}
