import type { IsoDateTime } from "../types";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export const TASK_STATUSES: readonly TaskStatus[] = [
    "TODO",
    "IN_PROGRESS",
    "DONE",
    "CANCELLED",
] as const;

export type CreateProjectTaskRequest = {
    name: string;
    description?: string | null;
    parentTaskId?: string | null;
    assigneeEmployeeId?: string | null;
    estimatedHours?: string | null;
};

export type UpdateProjectTaskRequest = {
    name?: string | null;
    description?: string | null;
    assigneeEmployeeId?: string | null;
    estimatedHours?: string | null;
    status?: TaskStatus | null;
};

export type SetTaskParentRequest = {
    parentTaskId: string | null;
};

export type ProjectTaskResponse = {
    id: string;
    projectId: string;
    parentTaskId: string | null;
    name: string;
    description: string | null;
    assigneeEmployeeId: string | null;
    estimatedHours: string | null;
    status: TaskStatus;
    organizationId: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};

export type ProjectTaskTreeNode = {
    id: string;
    name: string;
    status: TaskStatus;
    assigneeEmployeeId: string | null;
    children: ProjectTaskTreeNode[];
};
