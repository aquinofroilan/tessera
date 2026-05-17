import "server-only";

import { cache } from "react";

import { HttpError, serverClient } from "@/lib/http";
import { authed, authHeaders } from "@/lib/api/auth-helpers";
import type { AccountResponse, AccountType, CreateAccountRequest } from "./accounts";

const ACCOUNTS_PATH = "/finance/accounts";

type ListAccountsParams = { type?: AccountType; parentId?: string };

export const listAccounts = async (params?: ListAccountsParams): Promise<AccountResponse[]> =>
    authed(async () =>
        serverClient.get<AccountResponse[]>(ACCOUNTS_PATH, {
            query: { type: params?.type, parentId: params?.parentId },
            headers: await authHeaders(),
            cache: "no-store",
        }),
    );

export const createAccount = async (body: CreateAccountRequest): Promise<AccountResponse> =>
    authed(async () => serverClient.post<AccountResponse>(ACCOUNTS_PATH, body, { headers: await authHeaders() }));

export const getAccount = cache(async (id: string): Promise<AccountResponse | null> =>
    authed(async () => {
        try {
            return await serverClient.get<AccountResponse>(`${ACCOUNTS_PATH}/${id}`, {
                headers: await authHeaders(),
                cache: "no-store",
            });
        } catch (error) {
            if (error instanceof HttpError && error.status === 404) return null;
            throw error;
        }
    }),
);
