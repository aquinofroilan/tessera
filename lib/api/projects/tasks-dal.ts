import "server-only";

import { cache } from "react";

import { apiCreate, apiGet, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    CreateProjectTaskRequest,
    ProjectTaskResponse,
    ProjectTaskTreeNode,
    SetTaskParentRequest,
    UpdateProjectTaskRequest,
} from "./tasks";

const tasksPath = (projectId: string) => `/projects/${projectId}/tasks`;

export const listTasks = (projectId: string): Promise<ProjectTaskResponse[]> =>
    apiList<ProjectTaskResponse>(tasksPath(projectId));

export const getTaskTree = (projectId: string): Promise<ProjectTaskTreeNode[]> =>
    apiGet<ProjectTaskTreeNode[]>(`${tasksPath(projectId)}/tree`);

export const getTask = cache(
    (projectId: string, taskId: string): Promise<ProjectTaskResponse | null> =>
        apiGetOrNull<ProjectTaskResponse>(`${tasksPath(projectId)}/${taskId}`),
);

export const createTask = (
    projectId: string,
    body: CreateProjectTaskRequest,
): Promise<ProjectTaskResponse> =>
    apiCreate<ProjectTaskResponse>(tasksPath(projectId), body);

export const updateTask = (
    projectId: string,
    taskId: string,
    body: UpdateProjectTaskRequest,
): Promise<ProjectTaskResponse> =>
    authed(async () =>
        serverClient.patch<ProjectTaskResponse>(`${tasksPath(projectId)}/${taskId}`, body, {
            headers: await authHeaders(),
        }),
    );

export const setTaskParent = (
    projectId: string,
    taskId: string,
    body: SetTaskParentRequest,
): Promise<ProjectTaskResponse> =>
    authed(async () =>
        serverClient.put<ProjectTaskResponse>(`${tasksPath(projectId)}/${taskId}/parent`, body, {
            headers: await authHeaders(),
        }),
    );
