import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    CreateProjectRequest,
    ProjectResponse,
    ProjectStatus,
    UpdateProjectRequest,
} from "./projects";

const PROJECTS_PATH = "/projects";

type ListProjectsQuery = {
    status?: ProjectStatus;
    customerId?: string;
};

export const listProjects = (query?: ListProjectsQuery): Promise<ProjectResponse[]> =>
    apiList<ProjectResponse>(PROJECTS_PATH, query);

export const getProject = cache(
    (id: string): Promise<ProjectResponse | null> =>
        apiGetOrNull<ProjectResponse>(`${PROJECTS_PATH}/${id}`),
);

export const createProject = (body: CreateProjectRequest): Promise<ProjectResponse> =>
    apiCreate<ProjectResponse>(PROJECTS_PATH, body);

export const updateProject = (
    id: string,
    body: UpdateProjectRequest,
): Promise<ProjectResponse> =>
    authed(async () =>
        serverClient.patch<ProjectResponse>(`${PROJECTS_PATH}/${id}`, body, {
            headers: await authHeaders(),
        }),
    );

export const activateProject = (id: string): Promise<ProjectResponse> =>
    authed(async () =>
        serverClient.post<ProjectResponse>(`${PROJECTS_PATH}/${id}/activate`, undefined, {
            headers: await authHeaders(),
        }),
    );

export const holdProject = (id: string): Promise<ProjectResponse> =>
    authed(async () =>
        serverClient.post<ProjectResponse>(`${PROJECTS_PATH}/${id}/hold`, undefined, {
            headers: await authHeaders(),
        }),
    );

export const closeProject = (id: string): Promise<ProjectResponse> =>
    authed(async () =>
        serverClient.post<ProjectResponse>(`${PROJECTS_PATH}/${id}/close`, undefined, {
            headers: await authHeaders(),
        }),
    );

export const cancelProject = (id: string): Promise<ProjectResponse> =>
    authed(async () =>
        serverClient.post<ProjectResponse>(`${PROJECTS_PATH}/${id}/cancel`, undefined, {
            headers: await authHeaders(),
        }),
    );
