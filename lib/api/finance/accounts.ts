import type { IsoDateTime } from "../types";

export type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";

export type CreateAccountRequest = {
    code: string;
    name: string;
    type: AccountType;
    parentId?: string | null;
    description?: string | null;
};

export type UpdateAccountRequest = {
    name?: string | null;
    description?: string | null;
};

export type AccountResponse = {
    id: string;
    code: string;
    name: string;
    description: string | null;
    type: AccountType;
    parentId: string | null;
    organizationId: string;
    isActive: boolean;
    isSystemAccount: boolean;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
