import type { IsoDateTime } from "./types";

export type NotificationChannel = "IN_APP" | "EMAIL";

export type NotificationPreferenceResponse = {
    kind: string;
    channel: NotificationChannel;
    enabled: boolean;
    updatedAt: IsoDateTime | null;
};

export type NotificationPreferenceEntry = {
    kind: string;
    channel: NotificationChannel;
    enabled: boolean;
};

export type UpdateNotificationPreferencesRequest = {
    preferences: NotificationPreferenceEntry[];
};

/**
 * Kinds the platform publishes today. The DB column is freeform, but the
 * preferences UI needs a finite list to render toggles for — this is the
 * matching frontend mirror of the backend's NotificationKinds object.
 *
 * Add new kinds here as new event listeners ship.
 */
export const KNOWN_NOTIFICATION_KINDS: ReadonlyArray<{
    kind: string;
    label: string;
    description: string;
}> = [
    {
        kind: "leave_request.approved",
        label: "Leave request approved",
        description: "Your time-off request was approved.",
    },
    {
        kind: "leave_request.rejected",
        label: "Leave request rejected",
        description: "Your time-off request was rejected.",
    },
    {
        kind: "purchase_request.approved",
        label: "Purchase request approved",
        description: "Your purchase request was approved and is ready to convert into a PO.",
    },
    {
        kind: "purchase_request.rejected",
        label: "Purchase request rejected",
        description: "Your purchase request was rejected.",
    },
] as const;

export const NOTIFICATION_CHANNELS: ReadonlyArray<{ channel: NotificationChannel; label: string }> = [
    { channel: "IN_APP", label: "In-app" },
    { channel: "EMAIL", label: "Email" },
] as const;
