import "server-only";

import { cache } from "react";

import { HttpError, serverClient } from "@/lib/http";
import { authed, authHeaders } from "@/lib/api/auth-helpers";
import type { CreateVendorRequest, VendorResponse } from "./vendors";

const VENDORS_PATH = "/finance/ap/vendors";

export const listVendors = async (): Promise<VendorResponse[]> =>
    authed(async () =>
        serverClient.get<VendorResponse[]>(VENDORS_PATH, {
            headers: await authHeaders(),
            cache: "no-store",
        }),
    );

export const createVendor = async (body: CreateVendorRequest): Promise<VendorResponse> =>
    authed(async () => serverClient.post<VendorResponse>(VENDORS_PATH, body, { headers: await authHeaders() }));

export const getVendor = cache(async (id: string): Promise<VendorResponse | null> =>
    authed(async () => {
        try {
            return await serverClient.get<VendorResponse>(`${VENDORS_PATH}/${id}`, {
                headers: await authHeaders(),
                cache: "no-store",
            });
        } catch (error) {
            if (error instanceof HttpError && error.status === 404) return null;
            throw error;
        }
    }),
);
