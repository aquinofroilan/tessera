import { type ReactNode } from "react";

import { Button } from "@/components/ui";

export type StatusActionBarItem = {
    key: string;
    label: string;
    icon: ReactNode;
    variant: "default" | "outline";
    onClick?: () => void;
};

export function StatusActionBar({ actions }: { actions: StatusActionBarItem[] }) {
    if (!actions.length) return null;
    return (
        <>
            {actions.map((a) => (
                <Button key={a.key} variant={a.variant} size="sm" onClick={a.onClick}>
                    {a.icon}
                    {a.label}
                </Button>
            ))}
        </>
    );
}
