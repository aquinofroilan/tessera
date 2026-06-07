import type { ProjectStatus } from "@/lib/api/projects/projects";
import { StatusBadge } from "../../hr/_components/StatusBadge";

const STYLES: Record<ProjectStatus, string> = {
    PLANNED: "bg-(--paper-2) text-(--ink-soft)",
    ACTIVE: "bg-(--accent)/15 text-(--accent)",
    ON_HOLD: "bg-(--rule) text-(--ink-soft)",
    CLOSED: "bg-(--rule) text-(--muted)",
    CANCELLED: "bg-(--rule) text-(--muted)",
};

const LABELS: Record<ProjectStatus, string> = {
    PLANNED: "Planned",
    ACTIVE: "Active",
    ON_HOLD: "On hold",
    CLOSED: "Closed",
    CANCELLED: "Cancelled",
};

export const ProjectStatusBadge = ({ status }: { status: ProjectStatus }) => (
    <StatusBadge status={status} styles={STYLES} labels={LABELS} />
);
