import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    CreateDepartmentRequest,
    DepartmentResponse,
    UpdateDepartmentRequest,
} from "./departments";

const DEPARTMENTS_PATH = "/hr/departments";

export const listDepartments = (activeOnly = false): Promise<DepartmentResponse[]> =>
    apiList<DepartmentResponse>(DEPARTMENTS_PATH, { activeOnly });

export const getDepartment = cache(
    (id: string): Promise<DepartmentResponse | null> =>
        apiGetOrNull<DepartmentResponse>(`${DEPARTMENTS_PATH}/${id}`),
);

export const createDepartment = (body: CreateDepartmentRequest): Promise<DepartmentResponse> =>
    apiCreate<DepartmentResponse>(DEPARTMENTS_PATH, body);

export const updateDepartment = (
    id: string,
    body: UpdateDepartmentRequest,
): Promise<DepartmentResponse> =>
    authed(async () =>
        serverClient.patch<DepartmentResponse>(`${DEPARTMENTS_PATH}/${id}`, body, {
            headers: await authHeaders(),
        }),
    );

export const deactivateDepartment = (id: string): Promise<DepartmentResponse> =>
    authed(async () =>
        serverClient.del<DepartmentResponse>(`${DEPARTMENTS_PATH}/${id}`, {
            headers: await authHeaders(),
        }),
    );
