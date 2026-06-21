"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconArrowUpRight, IconCheck, IconLoader2 } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import type { NotificationResponse } from "@/lib/api/notifications";
import { markReadAction } from "../_data/notification-actions";
import { NotificationCategoryBadge } from "./NotificationCategoryBadge";

const formatTimestamp = (iso: string | null): string => {
    if (!iso) return "—";
    return iso.slice(0, 19).replace("T", " ");
};

export function NotificationRow({ notification }: { notification: NotificationResponse }) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const unread = notification.readAt === null;

    const onMarkRead = () => {
        startTransition(async () => {
            const result = await markReadAction(notification.id);
            if (!result.ok) {
                toast.error(result.error);
                return;
            }
            router.refresh();
        });
    };

    return (
        <div
            className={`grid grid-cols-[auto_1fr_auto] items-start gap-4 px-5 py-4 transition-colors ${
                unread ? "bg-(--paper)" : "bg-(--paper-2)/40"
            }`}>
            <NotificationCategoryBadge category={notification.category} />
            <div className="grid gap-1">
                <div className="flex flex-wrap items-baseline gap-2">
                    <span
                        className={`text-[14px] ${
                            unread ? "text-foreground font-medium" : "text-(--ink-soft)"
                        }`}>
                        {notification.title}
                    </span>
                    {unread && (
                        <span
                            aria-hidden
                            className="size-1.5 rounded-full bg-(--accent)"
                            title="Unread"
                        />
                    )}
                </div>
                {notification.body && (
                    <p className="text-[13px] text-(--ink-soft)">{notification.body}</p>
                )}
                <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.04em] text-(--muted) uppercase tabular-nums">
                    <span>{formatTimestamp(notification.createdAt)}</span>
                    <span aria-hidden>·</span>
                    <span>{notification.kind}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {notification.link && (
                    <Button asChild variant="ghost" size="icon-sm" aria-label="Open source">
                        <Link href={notification.link}>
                            <IconArrowUpRight stroke={1.8} />
                        </Link>
                    </Button>
                )}
                {unread && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onMarkRead}
                        disabled={pending}>
                        {pending ? (
                            <IconLoader2 className="size-4 animate-[spin_0.9s_linear_infinite]" />
                        ) : (
                            <IconCheck stroke={1.8} />
                        )}
                        {pending ? "…" : "Mark read"}
                    </Button>
                )}
            </div>
        </div>
    );
}
