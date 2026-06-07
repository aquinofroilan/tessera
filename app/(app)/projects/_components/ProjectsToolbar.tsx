"use client";

import type { ProjectStatus } from "@/lib/api/projects/projects";
import { StatusToolbar, type StatusToolbarTab } from "../../finance/_components/StatusToolbar";

type Props = {
    activeStatus: ProjectStatus | "ALL";
    initialQ: string;
    counts: Record<ProjectStatus | "ALL", number>;
};

const tabs: StatusToolbarTab<ProjectStatus>[] = [
    { value: "ALL", label: "All" },
    { value: "PLANNED", label: "Planned" },
    { value: "ACTIVE", label: "Active" },
    { value: "ON_HOLD", label: "On hold" },
    { value: "CLOSED", label: "Closed" },
    { value: "CANCELLED", label: "Cancelled" },
];

export const ProjectsToolbar = ({ activeStatus, initialQ, counts }: Props) => (
    <StatusToolbar
        tabs={tabs}
        activeStatus={activeStatus}
        initialQ={initialQ}
        counts={counts}
        searchPlaceholder="Search number, name, customer…"
        searchAriaLabel="Search projects"
        tabsAriaLabel="Filter by status"
        paramKey="status"
    />
);
