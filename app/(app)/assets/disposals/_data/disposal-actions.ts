"use server";

import { revalidatePath } from "next/cache";

import { runCreateAction, type CreateActionResult } from "@/lib/api/create-action";
import type { CreateAssetDisposalRequest } from "@/lib/api/assets/disposals";
import { createAssetDisposal, postAssetDisposal } from "@/lib/api/assets/disposals-dal";

import {
    disposalFormSchema,
    type DisposalFormValues,
} from "./disposal-form-schema";

const blankToNull = (value: string | undefined | null): string | null => {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
};

export async function createAssetDisposalAction(
    values: DisposalFormValues,
): Promise<CreateActionResult | void> {
    return runCreateAction<DisposalFormValues, CreateAssetDisposalRequest>({
        values,
        schema: disposalFormSchema,
        path: "/assets/disposals",
        errorMessage: "Couldn't create the disposal. Try again.",
        create: createAssetDisposal,
        toBody: (v) => ({
            assetId: v.assetId,
            disposalDate: v.disposalDate,
            disposalType: v.disposalType,
            proceeds: v.proceeds?.trim() || "0",
            gainLossAccountId: blankToNull(v.gainLossAccountId),
            cashAccountId: blankToNull(v.cashAccountId),
            notes: blankToNull(v.notes),
        }),
    });
}

export type PostDisposalResult = { ok: true } | { ok: false; error: string };

export async function postAssetDisposalAction(id: string): Promise<PostDisposalResult> {
    try {
        await postAssetDisposal(id);
    } catch {
        return { ok: false, error: "Couldn't post the disposal. Try again." };
    }
    revalidatePath("/assets/disposals");
    revalidatePath(`/assets/disposals/${id}`);
    revalidatePath("/assets");
    return { ok: true };
}
