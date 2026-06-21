"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconChecks, IconLoader2 } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { markAllReadAction } from "../_data/notification-actions";

type Props = {
    unreadCount: number;
};

export function MarkAllReadButton({ unreadCount }: Props) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const disabled = unreadCount === 0 || pending;

    const onClick = () => {
        startTransition(async () => {
            const result = await markAllReadAction();
            if (!result.ok) {
                toast.error(result.error);
                return;
            }
            toast.success(`Marked ${unreadCount} as read.`);
            router.refresh();
        });
    };

    return (
        <Button type="button" variant="outline" size="sm" onClick={onClick} disabled={disabled}>
            {pending ? (
                <IconLoader2 className="size-4 animate-[spin_0.9s_linear_infinite]" />
            ) : (
                <IconChecks stroke={1.8} />
            )}
            Mark all read
        </Button>
    );
}
