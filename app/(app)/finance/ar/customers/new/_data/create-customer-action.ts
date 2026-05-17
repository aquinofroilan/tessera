"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import type { CreateCustomerRequest } from "@/lib/api/finance/customers";
import { createCustomer } from "@/lib/api/finance/customers-dal";
import { newCustomerSchema, type NewCustomerValues } from "./new-customer-schema";

export type CreateCustomerResult = { ok: false; error: string };

export const createCustomerAction = async (values: NewCustomerValues): Promise<CreateCustomerResult | void> => {
    const parsed = newCustomerSchema.safeParse(values);
    if (!parsed.success) {
        return { ok: false, error: "Please check the form and try again." };
    }

    const v = parsed.data;
    const body: CreateCustomerRequest = {
        name: v.name,
        contactName: v.contactName?.trim() || null,
        contactEmail: v.contactEmail?.trim() || null,
        contactPhone: v.contactPhone?.trim() || null,
        paymentTermDays: Number(v.paymentTermDays),
        defaultRevenueAccountId: v.defaultRevenueAccountId?.trim() || null,
    };

    try {
        await createCustomer(body);
    } catch {
        return { ok: false, error: "Couldn't create the customer. Try again." };
    }

    revalidatePath("/finance/ar/customers");
    redirect("/finance/ar/customers");
};
