import "server-only";

import { apiCreate, apiGet, apiList } from "@/lib/api/dal";
import type {
    CreateEmployeeCompensationRequest,
    EmployeeCompensationResponse,
} from "./compensation";

const path = (employeeId: string) => `/hr/employees/${employeeId}/compensation`;

export const listCompensation = (employeeId: string): Promise<EmployeeCompensationResponse[]> =>
    apiList<EmployeeCompensationResponse>(path(employeeId));

export const getCurrentCompensation = (
    employeeId: string,
    asOf?: string,
): Promise<EmployeeCompensationResponse> =>
    apiGet<EmployeeCompensationResponse>(`${path(employeeId)}/current`, { asOf });

export const addCompensation = (
    employeeId: string,
    body: CreateEmployeeCompensationRequest,
): Promise<EmployeeCompensationResponse> =>
    apiCreate<EmployeeCompensationResponse>(path(employeeId), body);
