"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import type { AccountType, CreateAccountRequest } from "@/lib/api/finance/accounts";
import { createAccount } from "@/lib/api/finance/accounts-dal";
import { newAccountSchema, type NewAccountValues } from "./new-account-schema";

export type CreateAccountResult = { ok: false; error: string };

export const createAccountAction = async (values: NewAccountValues): Promise<CreateAccountResult | void> => {
    const parsed = newAccountSchema.safeParse(values);
    if (!parsed.success) {
        return { ok: false, error: "Please check the form and try again." };
    }

    const v = parsed.data;
    const body: CreateAccountRequest = {
        code: v.code,
        name: v.name,
        type: v.type as AccountType,
        parentId: v.parentId?.trim() || null,
        description: v.description?.trim() || null,
    };

    try {
        await createAccount(body);
    } catch {
        return { ok: false, error: "Couldn't create the account. Try again." };
    }

    revalidatePath("/finance/accounts");
    redirect("/finance/accounts");
};
