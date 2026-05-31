import "server-only";

import { cache } from "react";

import { apiCreate, apiGet, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    CreateLeaveRequestRequest,
    LeaveBalanceResponse,
    LeaveRequestResponse,
    LeaveRequestStatus,
    RejectLeaveRequestRequest,
} from "./leave-requests";

const PATH = "/hr/leave-requests";

type ListQuery = {
    employeeId?: string;
    status?: LeaveRequestStatus;
};

export const listLeaveRequests = (query?: ListQuery): Promise<LeaveRequestResponse[]> =>
    apiList<LeaveRequestResponse>(PATH, query);

export const getLeaveRequest = cache(
    (id: string): Promise<LeaveRequestResponse | null> =>
        apiGetOrNull<LeaveRequestResponse>(`${PATH}/${id}`),
);

export const createLeaveRequest = (
    body: CreateLeaveRequestRequest,
): Promise<LeaveRequestResponse> => apiCreate<LeaveRequestResponse>(PATH, body);

export const getLeaveBalance = (
    employeeId: string,
    leaveTypeId: string,
    year?: number,
): Promise<LeaveBalanceResponse> =>
    apiGet<LeaveBalanceResponse>(`${PATH}/balance`, { employeeId, leaveTypeId, year });

export const approveLeaveRequest = (id: string): Promise<LeaveRequestResponse> =>
    authed(async () =>
        serverClient.post<LeaveRequestResponse>(`${PATH}/${id}/approve`, undefined, {
            headers: await authHeaders(),
        }),
    );

export const rejectLeaveRequest = (
    id: string,
    body: RejectLeaveRequestRequest,
): Promise<LeaveRequestResponse> =>
    authed(async () =>
        serverClient.post<LeaveRequestResponse>(`${PATH}/${id}/reject`, body, {
            headers: await authHeaders(),
        }),
    );

export const cancelLeaveRequest = (id: string): Promise<LeaveRequestResponse> =>
    authed(async () =>
        serverClient.post<LeaveRequestResponse>(`${PATH}/${id}/cancel`, undefined, {
            headers: await authHeaders(),
        }),
    );
