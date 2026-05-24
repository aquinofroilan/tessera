"use client";

import type { ComponentProps } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { IconSearch } from "@tabler/icons-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const Command = ({ className, ...props }: ComponentProps<typeof CommandPrimitive>) => (
    <CommandPrimitive
        data-slot="command"
        className={cn("flex size-full flex-col overflow-hidden rounded-lg bg-(--card) text-(--ink)", className)}
        {...props}
    />
);

type CommandDialogProps = ComponentProps<typeof Dialog> & {
    title?: string;
    description?: string;
    className?: string;
};

const CommandDialog = ({
    title = "Command palette",
    description = "Search for routes and actions",
    children,
    className,
    ...props
}: CommandDialogProps) => (
    <Dialog {...props}>
        <DialogContent
            showCloseButton={false}
            className={cn("overflow-hidden p-0 sm:max-w-xl", className)}>
            <div className="sr-only">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </div>
            <Command className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-(--muted) [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group]]:px-1.5 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-1.5 [&_[cmdk-input-wrapper]_svg]:size-4 [&_[cmdk-input]]:h-11">
                {children}
            </Command>
        </DialogContent>
    </Dialog>
);

const CommandInput = ({ className, ...props }: ComponentProps<typeof CommandPrimitive.Input>) => (
    <div className="flex items-center gap-2 border-b border-(--rule) px-3.5" cmdk-input-wrapper="">
        <IconSearch className="size-3.5 text-(--muted)" stroke={1.8} />
        <CommandPrimitive.Input
            data-slot="command-input"
            className={cn(
                "flex h-11 w-full bg-transparent text-[13.5px] text-(--ink) outline-none placeholder:text-(--muted) disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        />
    </div>
);

const CommandList = ({ className, ...props }: ComponentProps<typeof CommandPrimitive.List>) => (
    <CommandPrimitive.List
        data-slot="command-list"
        className={cn("max-h-80 overflow-x-hidden overflow-y-auto py-1.5", className)}
        {...props}
    />
);

const CommandEmpty = ({ className, ...props }: ComponentProps<typeof CommandPrimitive.Empty>) => (
    <CommandPrimitive.Empty
        data-slot="command-empty"
        className={cn("py-6 text-center text-[13px] text-(--muted)", className)}
        {...props}
    />
);

const CommandGroup = ({ className, ...props }: ComponentProps<typeof CommandPrimitive.Group>) => (
    <CommandPrimitive.Group
        data-slot="command-group"
        className={cn("overflow-hidden text-(--ink)", className)}
        {...props}
    />
);

const CommandSeparator = ({ className, ...props }: ComponentProps<typeof CommandPrimitive.Separator>) => (
    <CommandPrimitive.Separator
        data-slot="command-separator"
        className={cn("my-1 h-px bg-(--rule)", className)}
        {...props}
    />
);

const CommandItem = ({ className, ...props }: ComponentProps<typeof CommandPrimitive.Item>) => (
    <CommandPrimitive.Item
        data-slot="command-item"
        className={cn(
            "relative flex cursor-default items-center gap-2.5 rounded-md px-2.5 py-1.75 text-[13px] text-(--ink-soft) outline-none select-none",
            "data-[selected=true]:bg-(--paper-2) data-[selected=true]:text-(--ink)",
            "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:text-(--muted)",
            "data-[selected=true]:[&_svg]:text-(--ink-soft)",
            className,
        )}
        {...props}
    />
);

const CommandShortcut = ({ className, ...props }: ComponentProps<"span">) => (
    <span
        data-slot="command-shortcut"
        className={cn(
            "ml-auto rounded border border-(--rule) bg-(--paper) px-1.25 py-px font-mono text-[10px] tracking-[0.04em] text-(--muted)",
            className,
        )}
        {...props}
    />
);

export {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
};
