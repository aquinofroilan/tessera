"use server";

import { runCreateAction, type CreateActionResult } from "@/lib/api/create-action";
import type { CreateFixedAssetRequest } from "@/lib/api/assets/assets";
import { createAsset } from "@/lib/api/assets/assets-dal";

import { assetFormSchema, type AssetFormValues } from "../../_data/asset-form-schema";

const blankToNull = (value: string | undefined | null): string | null => {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
};

export async function createAssetAction(
    values: AssetFormValues,
): Promise<CreateActionResult | void> {
    return runCreateAction<AssetFormValues, CreateFixedAssetRequest>({
        values,
        schema: assetFormSchema,
        path: "/assets",
        errorMessage: "Couldn't create the asset. Try again.",
        create: createAsset,
        toBody: (v) => ({
            name: v.name,
            description: blankToNull(v.description),
            categoryId: blankToNull(v.categoryId),
            acquisitionDate: v.acquisitionDate,
            acquisitionCost: v.acquisitionCost,
            salvageValue: v.salvageValue?.trim() || "0",
            usefulLifeMonths: Number.parseInt(v.usefulLifeMonths, 10),
            location: blankToNull(v.location),
            serialNumber: blankToNull(v.serialNumber),
            assetAccountId: blankToNull(v.assetAccountId),
            accumulatedDepreciationAccountId: blankToNull(v.accumulatedDepreciationAccountId),
            depreciationExpenseAccountId: blankToNull(v.depreciationExpenseAccountId),
        }),
    });
}
