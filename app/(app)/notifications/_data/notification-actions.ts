"use server";

import { revalidatePath } from "next/cache";

import {
    markAllNotificationsRead,
    markNotificationRead,
} from "@/lib/api/notifications-dal";

export type NotificationActionResult = { ok: true } | { ok: false; error: string };

const revalidate = () => {
    // Bell badge sits in (app) layout; revalidating both the layout and the
    // inbox page ensures the unread count updates everywhere on next render.
    revalidatePath("/(app)", "layout");
    revalidatePath("/notifications");
};

export async function markReadAction(id: string): Promise<NotificationActionResult> {
    try {
        await markNotificationRead(id);
    } catch {
        return { ok: false, error: "Couldn't mark as read. Try again." };
    }
    revalidate();
    return { ok: true };
}

export async function markAllReadAction(): Promise<NotificationActionResult> {
    try {
        await markAllNotificationsRead();
    } catch {
        return { ok: false, error: "Couldn't mark everything as read. Try again." };
    }
    revalidate();
    return { ok: true };
}
