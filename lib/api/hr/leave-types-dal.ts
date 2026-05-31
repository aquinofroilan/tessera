import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    CreateLeaveTypeRequest,
    LeaveTypeResponse,
    UpdateLeaveTypeRequest,
} from "./leave-types";

const PATH = "/hr/leave-types";

export const listLeaveTypes = (activeOnly = false): Promise<LeaveTypeResponse[]> =>
    apiList<LeaveTypeResponse>(PATH, { activeOnly });

export const getLeaveType = cache(
    (id: string): Promise<LeaveTypeResponse | null> => apiGetOrNull<LeaveTypeResponse>(`${PATH}/${id}`),
);

export const createLeaveType = (body: CreateLeaveTypeRequest): Promise<LeaveTypeResponse> =>
    apiCreate<LeaveTypeResponse>(PATH, body);

export const updateLeaveType = (
    id: string,
    body: UpdateLeaveTypeRequest,
): Promise<LeaveTypeResponse> =>
    authed(async () =>
        serverClient.patch<LeaveTypeResponse>(`${PATH}/${id}`, body, { headers: await authHeaders() }),
    );

export const deactivateLeaveType = (id: string): Promise<LeaveTypeResponse> =>
    authed(async () =>
        serverClient.del<LeaveTypeResponse>(`${PATH}/${id}`, { headers: await authHeaders() }),
    );
