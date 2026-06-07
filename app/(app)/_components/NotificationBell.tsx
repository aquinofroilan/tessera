import Link from "next/link";
import { IconBell } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { getMyUnreadCount } from "@/lib/api/notifications-dal";

const formatBadge = (count: number): string => {
    if (count <= 0) return "";
    if (count > 99) return "99+";
    return String(count);
};

export async function NotificationBell() {
    let unread = 0;
    try {
        const response = await getMyUnreadCount();
        unread = response.unread;
    } catch {
        // The bell is a non-critical surface — if the backend hiccups, render
        // the dot-less version rather than blowing up the topbar for every
        // page on the app.
        unread = 0;
    }

    const badge = formatBadge(unread);
    const hasUnread = unread > 0;

    return (
        <Button
            asChild
            variant="ghost"
            size="icon-sm"
            aria-label={hasUnread ? `Notifications: ${unread} unread` : "Notifications"}
            className="relative">
            <Link href="/notifications">
                <IconBell stroke={1.8} />
                {hasUnread && (
                    <span
                        aria-hidden
                        className="bg-(--accent) text-(--paper) border-(--paper) absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full border px-1 font-mono text-[9px] tracking-[0.02em] tabular-nums">
                        {badge}
                    </span>
                )}
            </Link>
        </Button>
    );
}
