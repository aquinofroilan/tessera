"use server";

import { revalidatePath } from "next/cache";

import type { CreateUomRequest } from "@/lib/api/inventory/uoms";
import { createUom } from "@/lib/api/inventory/uoms-dal";
import { uomFormSchema, type UomFormValues } from "../../../_data/uom-form-schema";

export const createUomAction = async (values: UomFormValues) => {
    const parsed = uomFormSchema.safeParse(values);
    if (!parsed.success) return { ok: false as const, error: "Please check the form and try again." };

    const body: CreateUomRequest = {
        code: parsed.data.code.trim().toUpperCase(),
        name: parsed.data.name.trim(),
        precision: Number(parsed.data.precision),
    };

    try {
        await createUom(body);
    } catch {
        return { ok: false as const, error: "Couldn't add the unit. Try again." };
    }

    revalidatePath("/inventory/settings/uoms");
};
