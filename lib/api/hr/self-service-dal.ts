import "server-only";

import { apiCreate, apiGet, apiGetOrNull, apiList } from "@/lib/api/dal";
import type {
    EmployeeCompensationResponse,
    EmployeeResponse,
    LeaveBalanceResponse,
    LeaveRequestResponse,
    SubmitSelfLeaveRequest,
} from "./self-service";

const ME_PATH = "/hr/me";

export const getMyProfile = (): Promise<EmployeeResponse | null> =>
    apiGetOrNull<EmployeeResponse>(ME_PATH);

export const listMyLeaveRequests = (): Promise<LeaveRequestResponse[]> =>
    apiList<LeaveRequestResponse>(`${ME_PATH}/leave-requests`);

export const submitMyLeave = (body: SubmitSelfLeaveRequest): Promise<LeaveRequestResponse> =>
    apiCreate<LeaveRequestResponse>(`${ME_PATH}/leave-requests`, body);

export const getMyLeaveBalance = (leaveTypeId: string, year?: number): Promise<LeaveBalanceResponse> =>
    apiGet<LeaveBalanceResponse>(`${ME_PATH}/leave-balance`, { leaveTypeId, year });

export const listMyCompensationHistory = (): Promise<EmployeeCompensationResponse[]> =>
    apiList<EmployeeCompensationResponse>(`${ME_PATH}/compensation`);

export const getMyCurrentCompensation = (asOf?: string): Promise<EmployeeCompensationResponse | null> =>
    apiGetOrNull<EmployeeCompensationResponse>(`${ME_PATH}/compensation/current${asOf ? `?asOf=${asOf}` : ""}`);
