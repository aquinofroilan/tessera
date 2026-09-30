"use client";

import type { ComponentProps } from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { Tick01Icon, ArrowDown01Icon, ArrowUp01Icon } from "hugeicons-react";

import { cn } from "@/lib/utils";

const Select = ({ ...props }: ComponentProps<typeof SelectPrimitive.Root>) => {
    return <SelectPrimitive.Root data-slot="select" {...props} />;
};

const SelectGroup = ({ className, ...props }: ComponentProps<typeof SelectPrimitive.Group>) => {
    return <SelectPrimitive.Group data-slot="select-group" className={cn("scroll-my-1 p-1", className)} {...props} />;
};

const SelectValue = ({ ...props }: ComponentProps<typeof SelectPrimitive.Value>) => {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />;
};

const SelectTrigger = ({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Trigger>) => {
    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            className={cn(
                "border-border bg-card text-foreground flex w-full items-center justify-between gap-2 rounded-[10px] border px-3.5 py-3 text-[14.5px] transition-colors outline-none",
                "data-placeholder:text-muted-foreground",
                "hover:border-ring",
                "focus:border-foreground focus:ring-[3px] focus:ring-ring/20",
                "disabled:cursor-not-allowed disabled:opacity-70",
                "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
                "*:data-[slot=select-value]:line-clamp-1",
                className,
            )}
            {...props}>
            {children}
            <SelectPrimitive.Icon asChild>
                <ArrowDown01Icon className="pointer-events-none size-4 shrink-0 text-muted-foreground" strokeWidth={1.8} />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
};

const SelectContent = ({
    className,
    children,
    position = "popper",
    align = "start",
    ...props
}: ComponentProps<typeof SelectPrimitive.Content>) => {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                data-slot="select-content"
                className={cn(
                    "bg-card text-foreground relative z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-[10px] border border-border shadow-md",
                    "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
                    "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
                    position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
                    className,
                )}
                position={position}
                align={align}
                {...props}>
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                    data-position={position}
                    className={cn(
                        "p-1",
                        position === "popper" && "h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)",
                    )}>
                    {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
};

const SelectLabel = ({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) => {
    return (
        <SelectPrimitive.Label
            data-slot="select-label"
            className={cn("px-2 py-1.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase", className)}
            {...props}
        />
    );
};

const SelectItem = ({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Item>) => {
    return (
        <SelectPrimitive.Item
            data-slot="select-item"
            className={cn(
                "relative flex w-full cursor-default items-center gap-2 rounded-md py-2 pr-8 pl-2.5 text-[14px] outline-hidden select-none",
                "focus:bg-accent focus:text-accent-foreground",
                                "data-disabled:pointer-events-none data-disabled:opacity-50",
                className,
            )}
            {...props}>
            <span className="pointer-events-none absolute right-2.5 flex size-4 items-center justify-center">
                <SelectPrimitive.ItemIndicator>
                    <Tick01Icon className="size-4 text-foreground" strokeWidth={2} />
                </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
};

const SelectSeparator = ({ className, ...props }: ComponentProps<typeof SelectPrimitive.Separator>) => {
    return (
        <SelectPrimitive.Separator
            data-slot="select-separator"
            className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
            {...props}
        />
    );
};

const SelectScrollUpButton = ({ className, ...props }: ComponentProps<typeof SelectPrimitive.ScrollUpButton>) => {
    return (
        <SelectPrimitive.ScrollUpButton
            data-slot="select-scroll-up-button"
            className={cn("bg-card flex cursor-default items-center justify-center py-1 text-muted-foreground", className)}
            {...props}>
            <ArrowUp01Icon className="size-4" strokeWidth={1.8} />
        </SelectPrimitive.ScrollUpButton>
    );
};

const SelectScrollDownButton = ({ className, ...props }: ComponentProps<typeof SelectPrimitive.ScrollDownButton>) => {
    return (
        <SelectPrimitive.ScrollDownButton
            data-slot="select-scroll-down-button"
            className={cn("bg-card flex cursor-default items-center justify-center py-1 text-muted-foreground", className)}
            {...props}>
            <ArrowDown01Icon className="size-4" strokeWidth={1.8} />
        </SelectPrimitive.ScrollDownButton>
    );
};

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
};
