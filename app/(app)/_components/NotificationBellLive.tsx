"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconBell } from "@tabler/icons-react";

import { Button } from "@/components/ui";

const formatBadge = (count: number): string => {
    if (count <= 0) return "";
    if (count > 99) return "99+";
    return String(count);
};

type Props = {
    initialUnread: number;
};

export function NotificationBellLive({ initialUnread }: Props) {
    const router = useRouter();
    const [unread, setUnread] = useState(initialUnread);

    useEffect(() => {
        const source = new EventSource("/api/notifications/stream");

        source.addEventListener("unread", (event) => {
            try {
                const data = JSON.parse((event as MessageEvent).data) as { unread?: number };
                if (typeof data.unread === "number") setUnread(data.unread);
            } catch {
                // Bad payload — drop silently; next message will reconcile.
            }
        });

        source.addEventListener("notification", () => {
            // Notification feed grew. If the user is sitting on /notifications,
            // refresh so the new row appears without a manual reload.
            router.refresh();
        });

        source.onerror = () => {
            // Browser's EventSource auto-reconnects with backoff. Nothing to do.
        };

        return () => {
            source.close();
        };
    }, [router]);

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
