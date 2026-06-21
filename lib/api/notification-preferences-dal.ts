import "server-only";

import { apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    NotificationPreferenceResponse,
    UpdateNotificationPreferencesRequest,
} from "./notification-preferences";

const PREFERENCES_PATH = "/notifications/preferences";

export const listMyNotificationPreferences = (): Promise<NotificationPreferenceResponse[]> =>
    apiList<NotificationPreferenceResponse>(PREFERENCES_PATH);

export const updateMyNotificationPreferences = (
    body: UpdateNotificationPreferencesRequest,
): Promise<NotificationPreferenceResponse[]> =>
    authed(async () =>
        serverClient.put<NotificationPreferenceResponse[]>(PREFERENCES_PATH, body, {
            headers: await authHeaders(),
        }),
    );
