"use client";

import type { ComponentProps } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { IconX } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

const Dialog = ({ ...props }: ComponentProps<typeof DialogPrimitive.Root>) => (
    <DialogPrimitive.Root data-slot="dialog" {...props} />
);

const DialogTrigger = ({ ...props }: ComponentProps<typeof DialogPrimitive.Trigger>) => (
    <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
);

const DialogPortal = ({ ...props }: ComponentProps<typeof DialogPrimitive.Portal>) => (
    <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
);

const DialogClose = ({ ...props }: ComponentProps<typeof DialogPrimitive.Close>) => (
    <DialogPrimitive.Close data-slot="dialog-close" {...props} />
);

const DialogOverlay = ({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) => (
    <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className={cn(
            "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
            className,
        )}
        {...props}
    />
);

const DialogContent = ({
    className,
    children,
    showCloseButton = true,
    ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { showCloseButton?: boolean }) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            data-slot="dialog-content"
            className={cn(
                "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-[18%] left-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 gap-4 rounded-xl border border-(--rule) bg-(--card) p-5 shadow-[0_24px_64px_-16px_rgba(23,22,15,0.28)] duration-150",
                className,
            )}
            {...props}>
            {children}
            {showCloseButton && (
                <DialogPrimitive.Close
                    className="absolute top-3.5 right-3.5 rounded-md p-1 text-(--muted) transition-colors hover:bg-(--paper-2) hover:text-(--ink) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
                    aria-label="Close">
                    <IconX className="size-4" stroke={1.8} />
                </DialogPrimitive.Close>
            )}
        </DialogPrimitive.Content>
    </DialogPortal>
);

const DialogTitle = ({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) => (
    <DialogPrimitive.Title
        data-slot="dialog-title"
        className={cn("text-sm font-medium tracking-[-0.005em] text-(--ink)", className)}
        {...props}
    />
);

const DialogDescription = ({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) => (
    <DialogPrimitive.Description
        data-slot="dialog-description"
        className={cn("text-[13px] text-(--muted)", className)}
        {...props}
    />
);

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
