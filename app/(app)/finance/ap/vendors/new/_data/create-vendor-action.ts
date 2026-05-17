"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import type { CreateVendorRequest } from "@/lib/api/finance/vendors";
import { createVendor } from "@/lib/api/finance/vendors-dal";
import { newVendorSchema, type NewVendorValues } from "./new-vendor-schema";

export type CreateVendorResult = { ok: false; error: string };

export const createVendorAction = async (values: NewVendorValues): Promise<CreateVendorResult | void> => {
    const parsed = newVendorSchema.safeParse(values);
    if (!parsed.success) {
        return { ok: false, error: "Please check the form and try again." };
    }

    const v = parsed.data;
    const body: CreateVendorRequest = {
        name: v.name,
        contactName: v.contactName?.trim() || null,
        contactEmail: v.contactEmail?.trim() || null,
        contactPhone: v.contactPhone?.trim() || null,
        paymentTermDays: Number(v.paymentTermDays),
        defaultExpenseAccountId: v.defaultExpenseAccountId?.trim() || null,
    };

    try {
        await createVendor(body);
    } catch {
        return { ok: false, error: "Couldn't create the vendor. Try again." };
    }

    revalidatePath("/finance/ap/vendors");
    redirect("/finance/ap/vendors");
};
