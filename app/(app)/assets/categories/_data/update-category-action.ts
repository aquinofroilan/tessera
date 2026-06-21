"use server";

import { revalidatePath } from "next/cache";

import { updateAssetCategory } from "@/lib/api/assets/assets-dal";

import {
    categoryFormSchema,
    type CategoryFormValues,
} from "./category-form-schema";

export type UpdateCategoryResult = { ok: false; error: string };

export async function updateAssetCategoryAction(
    id: string,
    values: CategoryFormValues,
    isActive: boolean,
): Promise<UpdateCategoryResult | void> {
    const parsed = categoryFormSchema.safeParse(values);
    if (!parsed.success) return { ok: false, error: "Please check the form and try again." };
    try {
        await updateAssetCategory(id, {
            name: parsed.data.name,
            description: parsed.data.description?.trim() || null,
            defaultUsefulLifeMonths: parsed.data.defaultUsefulLifeMonths
                ? Number.parseInt(parsed.data.defaultUsefulLifeMonths, 10)
                : null,
            defaultSalvageValue: parsed.data.defaultSalvageValue?.trim() || null,
            isActive,
        });
    } catch {
        return { ok: false, error: "Couldn't save the category. Try again." };
    }
    revalidatePath("/assets/categories");
    revalidatePath(`/assets/categories/${id}`);
}
