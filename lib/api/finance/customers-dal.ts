import "server-only";

import { cache } from "react";

import { HttpError, serverClient } from "@/lib/http";
import { authed, authHeaders } from "@/lib/api/auth-helpers";
import type { CreateCustomerRequest, CustomerResponse } from "./customers";

const CUSTOMERS_PATH = "/finance/ar/customers";

export const listCustomers = async (): Promise<CustomerResponse[]> =>
    authed(async () =>
        serverClient.get<CustomerResponse[]>(CUSTOMERS_PATH, {
            headers: await authHeaders(),
            cache: "no-store",
        }),
    );

export const createCustomer = async (body: CreateCustomerRequest): Promise<CustomerResponse> =>
    authed(async () => serverClient.post<CustomerResponse>(CUSTOMERS_PATH, body, { headers: await authHeaders() }));

export const getCustomer = cache(async (id: string): Promise<CustomerResponse | null> =>
    authed(async () => {
        try {
            return await serverClient.get<CustomerResponse>(`${CUSTOMERS_PATH}/${id}`, {
                headers: await authHeaders(),
                cache: "no-store",
            });
        } catch (error) {
            if (error instanceof HttpError && error.status === 404) return null;
            throw error;
        }
    }),
);
