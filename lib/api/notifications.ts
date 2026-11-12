export type NotificationCategory = "SYSTEM" | "APPROVAL" | "REMINDER" | "EVENT" | "INFO";

export type NotificationResponse = {
    id: string;
    recipientUserId: string;
    category: NotificationCategory;
    kind: string;
    title: string;
    body: string | null;
    link: string | null;
    readAt: string | null;
    createdAt: string | null;
};

export type NotificationUnreadCountResponse = {
    unread: number;
};

export type NotificationMarkAllReadResponse = {
    markedRead: number;
};
