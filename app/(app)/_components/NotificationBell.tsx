import { getMyUnreadCount } from "@/lib/api/notifications-dal";
import { NotificationBellLive } from "./NotificationBellLive";

export async function NotificationBell() {
    let initial = 0;
    try {
        const response = await getMyUnreadCount();
        initial = response.unread;
    } catch {
        // The bell is non-critical — render the live wrapper with a zero
        // starting count rather than blow up the topbar. The SSE stream's
        // first 'unread' event will reconcile the badge.
        initial = 0;
    }

    return <NotificationBellLive initialUnread={initial} />;
}
