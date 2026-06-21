"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
    createDepreciationRun,
    postDepreciationRun,
} from "@/lib/api/assets/depreciation-dal";

export type CreateRunResult = { ok: false; error: string };
export type PostRunResult = { ok: true } | { ok: false; error: string };

const monthAbsent = (value: number): boolean => Number.isNaN(value) || value < 1 || value > 12;

export async function createDepreciationRunAction(
    year: number,
    month: number,
): Promise<CreateRunResult | void> {
    if (!Number.isFinite(year) || year < 1900) return { ok: false, error: "Invalid year." };
    if (monthAbsent(month)) return { ok: false, error: "Invalid month." };

    let runId: string;
    try {
        const created = await createDepreciationRun({ periodYear: year, periodMonth: month });
        runId = created.id;
    } catch {
        return { ok: false, error: "Couldn't create the run. Try again." };
    }
    revalidatePath("/assets/depreciation-runs");
    redirect(`/assets/depreciation-runs/${runId}`);
}

export async function postDepreciationRunAction(id: string): Promise<PostRunResult> {
    try {
        await postDepreciationRun(id);
    } catch {
        return { ok: false, error: "Couldn't post the run. Try again." };
    }
    revalidatePath("/assets/depreciation-runs");
    revalidatePath(`/assets/depreciation-runs/${id}`);
    return { ok: true };
}
