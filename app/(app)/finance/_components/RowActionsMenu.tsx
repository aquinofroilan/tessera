"use client";

import { Fragment, type ReactNode } from "react";
import { IconDots } from "@tabler/icons-react";

import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui";

export type RowAction = {
    key: string;
    label: string;
    icon: ReactNode;
    destructive?: boolean;
    separatorBefore?: boolean;
    onSelect: () => void;
};

type RowActionsMenuProps = {
    label: string;
    triggerAriaLabel: string;
    actions: RowAction[];
};

export function RowActionsMenu({ label, triggerAriaLabel, actions }: RowActionsMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={triggerAriaLabel}>
                    <IconDots stroke={1.8} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{label}</DropdownMenuLabel>
                {actions.map((action) => (
                    <Fragment key={action.key}>
                        {action.separatorBefore && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                            variant={action.destructive ? "destructive" : "default"}
                            onSelect={action.onSelect}>
                            {action.icon}
                            {action.label}
                        </DropdownMenuItem>
                    </Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
