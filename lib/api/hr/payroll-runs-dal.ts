import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    CreatePayrollRunRequest,
    PayrollRunResponse,
    PayrollRunStatus,
} from "./payroll-runs";

const PATH = "/hr/payroll-runs";

export const listPayrollRuns = (status?: PayrollRunStatus): Promise<PayrollRunResponse[]> =>
    apiList<PayrollRunResponse>(PATH, status ? { status } : undefined);

export const getPayrollRun = cache(
    (id: string): Promise<PayrollRunResponse | null> =>
        apiGetOrNull<PayrollRunResponse>(`${PATH}/${id}`),
);

export const createPayrollRun = (body: CreatePayrollRunRequest): Promise<PayrollRunResponse> =>
    apiCreate<PayrollRunResponse>(PATH, body);

const transition = (id: string, action: "approve" | "pay" | "cancel") =>
    authed(async () =>
        serverClient.post<PayrollRunResponse>(`${PATH}/${id}/${action}`, undefined, {
            headers: await authHeaders(),
        }),
    );

export const approvePayrollRun = (id: string) => transition(id, "approve");
export const payPayrollRun = (id: string) => transition(id, "pay");
export const cancelPayrollRun = (id: string) => transition(id, "cancel");
