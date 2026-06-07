import type { TaskStatus } from "@/lib/api/projects/tasks";
import { StatusBadge } from "../../hr/_components/StatusBadge";

const STYLES: Record<TaskStatus, string> = {
    TODO: "bg-(--paper-2) text-(--ink-soft)",
    IN_PROGRESS: "bg-(--accent)/15 text-(--accent)",
    DONE: "bg-(--rule) text-(--muted)",
    CANCELLED: "bg-(--rule) text-(--muted)",
};

const LABELS: Record<TaskStatus, string> = {
    TODO: "To do",
    IN_PROGRESS: "In progress",
    DONE: "Done",
    CANCELLED: "Cancelled",
};

export const TaskStatusBadge = ({ status }: { status: TaskStatus }) => (
    <StatusBadge status={status} styles={STYLES} labels={LABELS} />
);
