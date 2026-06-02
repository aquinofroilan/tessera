"use server";

import { revalidatePath } from "next/cache";

import { updateMyNotificationPreferences } from "@/lib/api/notification-preferences-dal";
import type { UpdateNotificationPreferencesRequest } from "@/lib/api/notification-preferences";

export type SavePreferencesResult = { ok: true } | { ok: false; error: string };

export async function savePreferencesAction(
    body: UpdateNotificationPreferencesRequest,
): Promise<SavePreferencesResult> {
    try {
        await updateMyNotificationPreferences(body);
    } catch {
        return { ok: false, error: "Couldn't save your preferences. Try again." };
    }
    revalidatePath("/settings/notifications");
    return { ok: true };
}
