"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { AccountType, CreateAccountRequest } from "@/lib/api/finance/accounts";
import { createAccount } from "@/lib/api/finance/accounts-dal";
import { newAccountSchema, type NewAccountValues } from "./new-account-schema";

export const createAccountAction = async (values: NewAccountValues) =>
    runCreateAction<NewAccountValues, CreateAccountRequest>({
        values,
        schema: newAccountSchema,
        path: "/finance/accounts",
        errorMessage: "Couldn't create the account. Try again.",
        create: createAccount,
        toBody: (v) => ({
            code: v.code,
            name: v.name,
            type: v.type as AccountType,
            parentId: v.parentId?.trim() || null,
            description: v.description?.trim() || null,
        }),
    });
