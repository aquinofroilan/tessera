import "server-only";

import { apiGet, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    NotificationMarkAllReadResponse,
    NotificationResponse,
    NotificationUnreadCountResponse,
} from "./notifications";

const NOTIFICATIONS_PATH = "/notifications";

export const listMyNotifications = (): Promise<NotificationResponse[]> =>
    apiList<NotificationResponse>(NOTIFICATIONS_PATH);

export const getMyUnreadCount = (): Promise<NotificationUnreadCountResponse> =>
    apiGet<NotificationUnreadCountResponse>(`${NOTIFICATIONS_PATH}/unread-count`);

export const markNotificationRead = (id: string): Promise<NotificationResponse> =>
    authed(async () =>
        serverClient.post<NotificationResponse>(`${NOTIFICATIONS_PATH}/${id}/read`, undefined, {
            headers: await authHeaders(),
        }),
    );

export const markAllNotificationsRead = (): Promise<NotificationMarkAllReadResponse> =>
    authed(async () =>
        serverClient.post<NotificationMarkAllReadResponse>(`${NOTIFICATIONS_PATH}/read-all`, undefined, {
            headers: await authHeaders(),
        }),
    );
