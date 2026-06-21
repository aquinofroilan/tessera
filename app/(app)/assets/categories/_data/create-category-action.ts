"use server";

import { runCreateAction, type CreateActionResult } from "@/lib/api/create-action";
import type { CreateAssetCategoryRequest } from "@/lib/api/assets/assets";
import { createAssetCategory } from "@/lib/api/assets/assets-dal";

import {
    categoryFormSchema,
    type CategoryFormValues,
} from "./category-form-schema";

export async function createAssetCategoryAction(
    values: CategoryFormValues,
): Promise<CreateActionResult | void> {
    return runCreateAction<CategoryFormValues, CreateAssetCategoryRequest>({
        values,
        schema: categoryFormSchema,
        path: "/assets/categories",
        errorMessage: "Couldn't create the category. Try again.",
        create: createAssetCategory,
        toBody: (v) => ({
            code: v.code,
            name: v.name,
            description: v.description?.trim() || null,
            defaultUsefulLifeMonths: v.defaultUsefulLifeMonths ? Number.parseInt(v.defaultUsefulLifeMonths, 10) : null,
            defaultSalvageValue: v.defaultSalvageValue?.trim() || "0",
        }),
    });
}
