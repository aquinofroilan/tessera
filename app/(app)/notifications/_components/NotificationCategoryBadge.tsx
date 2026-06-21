import type { NotificationCategory } from "@/lib/api/notifications";

const TONES: Record<NotificationCategory, string> = {
    SYSTEM: "bg-(--ink) text-(--paper)",
    APPROVAL: "bg-(--sky) text-(--paper)",
    REMINDER: "bg-(--ochre) text-(--ink)",
    EVENT: "bg-(--moss) text-(--paper)",
    INFO: "bg-(--paper-3) text-(--ink-soft)",
};

const LABELS: Record<NotificationCategory, string> = {
    SYSTEM: "System",
    APPROVAL: "Approval",
    REMINDER: "Reminder",
    EVENT: "Event",
    INFO: "Info",
};

export const NotificationCategoryBadge = ({ category }: { category: NotificationCategory }) => (
    <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase ${TONES[category]}`}>
        {LABELS[category]}
    </span>
);
