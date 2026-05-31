import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    CreateEmployeeRequest,
    EmployeeResponse,
    EmploymentStatus,
    TerminateEmployeeRequest,
    UpdateEmployeeRequest,
} from "./employees";

const EMPLOYEES_PATH = "/hr/employees";

type ListEmployeesQuery = {
    status?: EmploymentStatus;
    departmentId?: string;
};

export const listEmployees = (query?: ListEmployeesQuery): Promise<EmployeeResponse[]> =>
    apiList<EmployeeResponse>(EMPLOYEES_PATH, query);

export const getEmployee = cache(
    (id: string): Promise<EmployeeResponse | null> =>
        apiGetOrNull<EmployeeResponse>(`${EMPLOYEES_PATH}/${id}`),
);

export const createEmployee = (body: CreateEmployeeRequest): Promise<EmployeeResponse> =>
    apiCreate<EmployeeResponse>(EMPLOYEES_PATH, body);

export const updateEmployee = (
    id: string,
    body: UpdateEmployeeRequest,
): Promise<EmployeeResponse> =>
    authed(async () =>
        serverClient.patch<EmployeeResponse>(`${EMPLOYEES_PATH}/${id}`, body, {
            headers: await authHeaders(),
        }),
    );

export const assignDepartment = (
    id: string,
    departmentId: string | null,
): Promise<EmployeeResponse> =>
    authed(async () =>
        serverClient.post<EmployeeResponse>(
            `${EMPLOYEES_PATH}/${id}/assign-department`,
            undefined,
            {
                query: departmentId ? { departmentId } : undefined,
                headers: await authHeaders(),
            },
        ),
    );

export const placeOnLeave = (id: string): Promise<EmployeeResponse> =>
    authed(async () =>
        serverClient.post<EmployeeResponse>(`${EMPLOYEES_PATH}/${id}/leave`, undefined, {
            headers: await authHeaders(),
        }),
    );

export const returnFromLeave = (id: string): Promise<EmployeeResponse> =>
    authed(async () =>
        serverClient.post<EmployeeResponse>(`${EMPLOYEES_PATH}/${id}/return`, undefined, {
            headers: await authHeaders(),
        }),
    );

export const terminateEmployee = (
    id: string,
    body: TerminateEmployeeRequest,
): Promise<EmployeeResponse> =>
    authed(async () =>
        serverClient.post<EmployeeResponse>(`${EMPLOYEES_PATH}/${id}/terminate`, body, {
            headers: await authHeaders(),
        }),
    );
