import type { Metadata } from "next";
import { IconInbox } from "@tabler/icons-react";

import { Card } from "@/components/ui";
import { listMyNotifications } from "@/lib/api/notifications-dal";
import { AppTopbar } from "../_components/AppTopbar";
import { Block } from "../_components/Block";
import { PageHeader } from "../_components/PageHeader";
import { MarkAllReadButton } from "./_components/MarkAllReadButton";
import { NotificationRow } from "./_components/NotificationRow";

export const metadata: Metadata = {
    title: "Notifications · Tessera",
    description: "Approvals, reminders, and system events sent to you.",
};

const NotificationsPage = async () => {
    const notifications = await listMyNotifications();
    const unreadCount = notifications.filter((n) => n.readAt === null).length;

    return (
        <>
            <AppTopbar crumbs={[{ label: "Notifications" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow="Inbox"
                        title={
                            <>
                                Notifications<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description={
                            unreadCount > 0
                                ? `${unreadCount} unread of ${notifications.length} total.`
                                : `Everything caught up — ${notifications.length} total.`
                        }
                        actions={<MarkAllReadButton unreadCount={unreadCount} />}
                    />

                    <Block title="Recent" description="Newest first.">
                        {notifications.length === 0 ? (
                            <Card className="items-center gap-3 px-6 py-12 text-center">
                                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                                    <IconInbox className="size-5" stroke={1.6} />
                                </span>
                                <div className="font-display text-foreground text-xl font-[380]">
                                    Nothing here yet.
                                </div>
                                <p className="max-w-80 text-sm text-(--muted)">
                                    Approvals on your requests, reminders, and system events show up here.
                                </p>
                            </Card>
                        ) : (
                            <Card className="grid divide-y divide-(--rule) p-0">
                                {notifications.map((notification) => (
                                    <NotificationRow key={notification.id} notification={notification} />
                                ))}
                            </Card>
                        )}
                    </Block>
                </div>
            </div>
        </>
    );
};

export default NotificationsPage;
