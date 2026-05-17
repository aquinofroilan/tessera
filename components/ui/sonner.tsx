"use client";

import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
    IconAlertOctagon,
    IconAlertTriangle,
    IconCircleCheck,
    IconInfoCircle,
    IconLoader2,
} from "@tabler/icons-react";

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="light"
            position="bottom-right"
            className="toaster group"
            icons={{
                success: <IconCircleCheck className="size-4 text-(--accent)" stroke={1.8} />,
                info: <IconInfoCircle className="size-4 text-(--ink-soft)" stroke={1.8} />,
                warning: <IconAlertTriangle className="size-4 text-(--accent)" stroke={1.8} />,
                error: <IconAlertOctagon className="size-4 text-(--accent)" stroke={1.8} />,
                loading: <IconLoader2 className="size-4 animate-spin text-(--muted)" stroke={1.8} />,
            }}
            style={
                {
                    "--normal-bg": "var(--card)",
                    "--normal-text": "var(--ink)",
                    "--normal-border": "var(--rule)",
                    "--error-bg": "var(--card)",
                    "--error-text": "var(--accent-deep)",
                    "--error-border": "var(--accent)",
                    "--border-radius": "10px",
                    fontFamily: "var(--font-inter)",
                } as CSSProperties
            }
            toastOptions={{
                classNames: {
                    toast: "shadow-[0_12px_32px_rgb(23_22_15/12%)]",
                    title: "text-[13px] font-medium tracking-[-0.01em]",
                    description: "text-[12px] text-(--ink-soft)",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
