import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    ConvertPurchaseRequestRequest,
    CreatePurchaseRequestRequest,
    PurchaseRequestResponse,
    PurchaseRequestStatus,
    RejectPurchaseRequestRequest,
} from "./purchase-requests";

const PATH = "/procurement/purchase-requests";

type ListQuery = {
    status?: PurchaseRequestStatus;
    requestedBy?: string;
};

export const listPurchaseRequests = (query?: ListQuery): Promise<PurchaseRequestResponse[]> =>
    apiList<PurchaseRequestResponse>(PATH, query);

export const getPurchaseRequest = cache(
    (id: string): Promise<PurchaseRequestResponse | null> =>
        apiGetOrNull<PurchaseRequestResponse>(`${PATH}/${id}`),
);

export const createPurchaseRequest = (
    body: CreatePurchaseRequestRequest,
): Promise<PurchaseRequestResponse> => apiCreate<PurchaseRequestResponse>(PATH, body);

const post = async <T>(path: string, body?: unknown): Promise<T> =>
    authed(async () =>
        serverClient.post<T>(path, body, { headers: await authHeaders() }),
    );

export const submitPurchaseRequest = (id: string): Promise<PurchaseRequestResponse> =>
    post<PurchaseRequestResponse>(`${PATH}/${id}/submit`);

export const approvePurchaseRequest = (id: string): Promise<PurchaseRequestResponse> =>
    post<PurchaseRequestResponse>(`${PATH}/${id}/approve`);

export const rejectPurchaseRequest = (
    id: string,
    body?: RejectPurchaseRequestRequest,
): Promise<PurchaseRequestResponse> => post<PurchaseRequestResponse>(`${PATH}/${id}/reject`, body);

export const cancelPurchaseRequest = (id: string): Promise<PurchaseRequestResponse> =>
    post<PurchaseRequestResponse>(`${PATH}/${id}/cancel`);

export const convertPurchaseRequest = (
    id: string,
    body?: ConvertPurchaseRequestRequest,
): Promise<unknown> => post<unknown>(`${PATH}/${id}/convert`, body);
