"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateVariantRequest } from "@/lib/api/inventory/variants";
import { createVariant } from "@/lib/api/inventory/variants-dal";
import {
    parseAttributes,
    variantFormSchema,
    type VariantFormValues,
} from "../../../_data/variant-form-schema";

const trimToNull = (v: string | undefined): string | null => (v?.trim() ? v.trim() : null);

export const createVariantAction = async (itemId: string, values: VariantFormValues) =>
    runCreateAction<VariantFormValues, CreateVariantRequest>({
        values,
        schema: variantFormSchema,
        toBody: (data) => ({
            skuSuffix: data.skuSuffix.trim(),
            attributes: parseAttributes(data.attributes),
            salesPrice: trimToNull(data.salesPrice),
            purchaseCost: trimToNull(data.purchaseCost),
        }),
        create: (body) => createVariant(itemId, body),
        path: `/inventory/items/${itemId}`,
        errorMessage: "Couldn't add the variant. Try again.",
    });
