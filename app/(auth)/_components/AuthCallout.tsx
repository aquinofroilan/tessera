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
                "mt-6 flex items-start gap-3 rounded-[10px] border border-dashed border-(--rule) bg-(--paper-2) px-4 py-3.5 text-[13px] leading-[1.5] text-(--ink-soft)",
                className,
            )}>
            <div className="grid size-7.5 flex-none place-items-center rounded-md bg-(--ink) text-(--paper)">
                {icon}
            </div>
            <div>
                <strong className="font-medium text-(--ink)">{title}</strong>
                <br />
                {children}
            </div>
        </div>
    );
}
