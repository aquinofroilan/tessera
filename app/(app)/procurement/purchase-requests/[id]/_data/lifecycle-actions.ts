"use server";

import { revalidatePath } from "next/cache";

import {
    approvePurchaseRequest,
    cancelPurchaseRequest,
    rejectPurchaseRequest,
    submitPurchaseRequest,
} from "@/lib/api/procurement/purchase-requests-dal";

export type LifecycleResult = { ok: true } | { ok: false; error: string };

const wrap = async (
    id: string,
    call: () => Promise<unknown>,
    errorMessage: string,
): Promise<LifecycleResult> => {
    try {
        await call();
    } catch {
        return { ok: false, error: errorMessage };
    }
    revalidatePath("/procurement/purchase-requests");
    revalidatePath(`/procurement/purchase-requests/${id}`);
    return { ok: true };
};

export async function submitAction(id: string): Promise<LifecycleResult> {
    return wrap(id, () => submitPurchaseRequest(id), "Couldn't submit the request.");
}

export async function approveAction(id: string): Promise<LifecycleResult> {
    return wrap(id, () => approvePurchaseRequest(id), "Couldn't approve the request.");
}

export async function rejectAction(id: string, reason: string): Promise<LifecycleResult> {
    return wrap(
        id,
        () => rejectPurchaseRequest(id, { reason: reason.trim() || null }),
        "Couldn't reject the request.",
    );
}

export async function cancelAction(id: string): Promise<LifecycleResult> {
    return wrap(id, () => cancelPurchaseRequest(id), "Couldn't cancel the request.");
}
