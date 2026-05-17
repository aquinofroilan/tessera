import "server-only";

import { cache } from "react";

import { HttpError, serverClient } from "@/lib/http";
import { authed, authHeaders } from "@/lib/api/auth-helpers";
import type {
    BillPaymentResponse,
    BillResponse,
    BillStatus,
    BillSummaryResponse,
    CreateBillRequest,
} from "./bills";

const BILLS_PATH = "/finance/ap/bills";

type ListBillsParams = { status?: BillStatus; vendorId?: string };

export const listBills = async (params?: ListBillsParams): Promise<BillSummaryResponse[]> =>
    authed(async () =>
        serverClient.get<BillSummaryResponse[]>(BILLS_PATH, {
            query: { status: params?.status, vendorId: params?.vendorId },
            headers: await authHeaders(),
            cache: "no-store",
        }),
    );

export const getBill = cache(async (id: string): Promise<BillResponse | null> =>
    authed(async () => {
        try {
            return await serverClient.get<BillResponse>(`${BILLS_PATH}/${id}`, {
                headers: await authHeaders(),
                cache: "no-store",
            });
        } catch (error) {
            if (error instanceof HttpError && error.status === 404) return null;
            throw error;
        }
    }),
);

export const getBillPayments = async (id: string): Promise<BillPaymentResponse[]> =>
    authed(async () =>
        serverClient.get<BillPaymentResponse[]>(`${BILLS_PATH}/${id}/payments`, {
            headers: await authHeaders(),
            cache: "no-store",
        }),
    );

export const createBill = async (body: CreateBillRequest): Promise<BillResponse> =>
    authed(async () => serverClient.post<BillResponse>(BILLS_PATH, body, { headers: await authHeaders() }));
