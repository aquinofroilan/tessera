import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { HttpError, serverClient } from "@/lib/http";
import { SESSION_COOKIE } from "@/lib/auth/session";
import type {
    BillPaymentResponse,
    BillResponse,
    BillStatus,
    BillSummaryResponse,
    CreateBillRequest,
} from "./bills";

const BILLS_PATH = "/finance/ap/bills";

const authHeaders = async (): Promise<HeadersInit> => {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    return token ? { authorization: `Bearer ${token}` } : {};
};

const authed = async <T>(call: () => Promise<T>): Promise<T> => {
    try {
        return await call();
    } catch (error) {
        if (error instanceof HttpError && error.status === 401) redirect("/signin");
        throw error;
    }
};

export const listBills = async (status?: BillStatus): Promise<BillSummaryResponse[]> =>
    authed(async () =>
        serverClient.get<BillSummaryResponse[]>(BILLS_PATH, {
            query: status ? { status } : undefined,
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
