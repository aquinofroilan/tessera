"use server";

import { revalidatePath } from "next/cache";

import { updateAsset } from "@/lib/api/assets/assets-dal";
import {
    assetFormSchema,
    type AssetFormValues,
} from "../../_data/asset-form-schema";

export type UpdateAssetResult = { ok: false; error: string };

const blankToNull = (value: string | undefined | null): string | null => {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
};

export async function updateAssetAction(
    id: string,
    values: AssetFormValues,
): Promise<UpdateAssetResult | void> {
    const parsed = assetFormSchema.safeParse(values);
    if (!parsed.success) {
        return { ok: false, error: "Please check the form and try again." };
    }
    try {
        await updateAsset(id, {
            name: parsed.data.name,
            description: blankToNull(parsed.data.description),
            categoryId: blankToNull(parsed.data.categoryId),
            location: blankToNull(parsed.data.location),
            serialNumber: blankToNull(parsed.data.serialNumber),
            assetAccountId: blankToNull(parsed.data.assetAccountId),
            accumulatedDepreciationAccountId: blankToNull(parsed.data.accumulatedDepreciationAccountId),
            depreciationExpenseAccountId: blankToNull(parsed.data.depreciationExpenseAccountId),
        });
    } catch {
        return { ok: false, error: "Couldn't save the asset. Try again." };
    }
    revalidatePath("/assets");
    revalidatePath(`/assets/${id}`);
}
