"use server";

import { revalidatePath } from "next/cache";

import type { CreateVariantRequest } from "@/lib/api/inventory/variants";
import { createVariant } from "@/lib/api/inventory/variants-dal";
import {
    parseAttributes,
    variantFormSchema,
    type VariantFormValues,
} from "../../../_data/variant-form-schema";

const trimToNull = (v: string | undefined): string | null => (v?.trim() ? v.trim() : null);

export const createVariantAction = async (itemId: string, values: VariantFormValues) => {
    const parsed = variantFormSchema.safeParse(values);
    if (!parsed.success) return { ok: false as const, error: "Please check the form and try again." };

    const body: CreateVariantRequest = {
        skuSuffix: parsed.data.skuSuffix.trim(),
        attributes: parseAttributes(parsed.data.attributes),
        salesPrice: trimToNull(parsed.data.salesPrice),
        purchaseCost: trimToNull(parsed.data.purchaseCost),
    };

    try {
        await createVariant(itemId, body);
    } catch {
        return { ok: false as const, error: "Couldn't add the variant. Try again." };
    }

    revalidatePath(`/inventory/items/${itemId}`);
};
