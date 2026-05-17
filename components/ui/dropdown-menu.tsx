"use client";

import { type ComponentProps } from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { IconCheck, IconChevronRight, IconPointFilled } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

function DropdownMenu({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Root>) {
    return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
    return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
    return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
    className,
    align = "end",
    sideOffset = 6,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
    return (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
                data-slot="dropdown-menu-content"
                sideOffset={sideOffset}
                align={align}
                className={cn(
                    "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-[60] max-h-(--radix-dropdown-menu-content-available-height) min-w-48 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-[10px] border border-(--rule) bg-(--card) p-1.5 text-(--ink) shadow-[0_12px_32px_-12px_rgba(23,22,15,0.18)] duration-100",
                    className,
                )}
                {...props}
            />
        </DropdownMenuPrimitive.Portal>
    );
}

function DropdownMenuGroup({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Group>) {
    return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuItem({
    className,
    inset,
    variant = "default",
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
}) {
    return (
        <DropdownMenuPrimitive.Item
            data-slot="dropdown-menu-item"
            data-inset={inset}
            data-variant={variant}
            className={cn(
                "group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-[13.5px] text-(--ink) outline-hidden transition-colors select-none",
                "focus:bg-(--paper-2) focus:text-(--ink)",
                "data-inset:pl-7",
                "data-[variant=destructive]:text-(--accent) data-[variant=destructive]:focus:bg-(--accent-soft) data-[variant=destructive]:focus:text-(--accent-deep) data-[variant=destructive]:*:[svg]:text-(--accent)",
                "data-disabled:pointer-events-none data-disabled:opacity-50",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:text-(--ink-soft)",
                className,
            )}
            {...props}
        />
    );
}

function DropdownMenuCheckboxItem({
    className,
    children,
    checked,
    inset,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
    inset?: boolean;
}) {
    return (
        <DropdownMenuPrimitive.CheckboxItem
            data-slot="dropdown-menu-checkbox-item"
            data-inset={inset}
            className={cn(
                "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-7 text-[13.5px] text-(--ink) outline-hidden transition-colors select-none",
                "focus:bg-(--paper-2) focus:text-(--ink)",
                "data-disabled:pointer-events-none data-disabled:opacity-50",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            checked={checked}
            {...props}>
            <span
                className="pointer-events-none absolute left-2 flex size-4 items-center justify-center"
                data-slot="dropdown-menu-checkbox-item-indicator">
                <DropdownMenuPrimitive.ItemIndicator>
                    <IconCheck className="text-(--ink)" />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.CheckboxItem>
    );
}

function DropdownMenuRadioGroup({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
    return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
    className,
    children,
    inset,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
    inset?: boolean;
}) {
    return (
        <DropdownMenuPrimitive.RadioItem
            data-slot="dropdown-menu-radio-item"
            data-inset={inset}
            className={cn(
                "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-7 text-[13.5px] text-(--ink) outline-hidden transition-colors select-none",
                "focus:bg-(--paper-2) focus:text-(--ink)",
                "data-disabled:pointer-events-none data-disabled:opacity-50",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}>
            <span
                className="pointer-events-none absolute left-2 flex size-4 items-center justify-center"
                data-slot="dropdown-menu-radio-item-indicator">
                <DropdownMenuPrimitive.ItemIndicator>
                    <IconPointFilled className="size-2 text-(--accent)" />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.RadioItem>
    );
}

function DropdownMenuLabel({
    className,
    inset,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
}) {
    return (
        <DropdownMenuPrimitive.Label
            data-slot="dropdown-menu-label"
            data-inset={inset}
            className={cn(
                "data-inset:pl-7 px-2 pt-1.5 pb-1 font-mono text-[10.5px] tracking-[0.16em] text-(--muted) uppercase",
                className,
            )}
            {...props}
        />
    );
}

function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
    return (
        <DropdownMenuPrimitive.Separator
            data-slot="dropdown-menu-separator"
            className={cn("pointer-events-none -mx-1 my-1 h-px bg-(--rule-soft)", className)}
            {...props}
        />
    );
}

function DropdownMenuShortcut({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            data-slot="dropdown-menu-shortcut"
            className={cn("ml-auto font-mono text-[10.5px] tracking-[0.12em] text-(--muted-2) uppercase", className)}
            {...props}
        />
    );
}

function DropdownMenuSub({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
    return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
}) {
    return (
        <DropdownMenuPrimitive.SubTrigger
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset}
            className={cn(
                "flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-[13.5px] text-(--ink) outline-hidden transition-colors select-none",
                "focus:bg-(--paper-2) focus:text-(--ink) data-open:bg-(--paper-2) data-open:text-(--ink)",
                "data-inset:pl-7",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:text-(--ink-soft)",
                className,
            )}
            {...props}>
            {children}
            <IconChevronRight className="ml-auto" />
        </DropdownMenuPrimitive.SubTrigger>
    );
}

function DropdownMenuSubContent({ className, ...props }: ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
    return (
        <DropdownMenuPrimitive.SubContent
            data-slot="dropdown-menu-sub-content"
            className={cn(
                "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-[60] min-w-40 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-[10px] border border-(--rule) bg-(--card) p-1.5 text-(--ink) shadow-[0_12px_32px_-12px_rgba(23,22,15,0.18)] duration-100",
                className,
            )}
            {...props}
        />
    );
}

export {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
};
