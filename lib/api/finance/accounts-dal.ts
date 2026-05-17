import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import type { AccountResponse, AccountType, CreateAccountRequest } from "./accounts";

const ACCOUNTS_PATH = "/finance/accounts";

type ListAccountsParams = { type?: AccountType; parentId?: string };

export const listAccounts = (params?: ListAccountsParams): Promise<AccountResponse[]> =>
    apiList<AccountResponse>(ACCOUNTS_PATH, { type: params?.type, parentId: params?.parentId });

export const createAccount = (body: CreateAccountRequest): Promise<AccountResponse> =>
    apiCreate<AccountResponse>(ACCOUNTS_PATH, body);

export const getAccount = cache(
    (id: string): Promise<AccountResponse | null> => apiGetOrNull<AccountResponse>(`${ACCOUNTS_PATH}/${id}`),
);
