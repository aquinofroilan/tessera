"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import type {
    CreateMovementRequest,
    MovementLineRequest,
} from "@/lib/api/inventory/movements";
import { createMovement } from "@/lib/api/inventory/movements-dal";
import {
    isAdjustment,
    movementFormSchema,
    type MovementFormValues,
} from "../../../_data/movement-form-schema";

const trimToNull = (v: string | undefined): string | null => (v?.trim() ? v.trim() : null);

export const createMovementAction = async (
    values: MovementFormValues,
    source?: { billId?: string; invoiceId?: string },
) => {
    const parsed = movementFormSchema.safeParse(values);
    if (!parsed.success) return { ok: false as const, error: "Please check the form and try again." };
    const v = parsed.data;

    if (v.type === "RECEIPT" && (!v.unitCost || !v.unitCost.trim())) {
        return { ok: false as const, error: "Unit cost is required for receipts." };
    }
    if (v.type === "TRANSFER" && (!v.toWarehouseId || !v.toWarehouseId.trim())) {
        return { ok: false as const, error: "Pick a destination warehouse for the transfer." };
    }
    if (v.type === "TRANSFER" && v.toWarehouseId?.trim() === v.warehouseId) {
        return { ok: false as const, error: "Source and destination must differ." };
    }
    if (isAdjustment(v.type) && !v.reason) {
        return { ok: false as const, error: "Pick a reason for the adjustment." };
    }

    const line: MovementLineRequest = {
        itemId: v.itemId,
        quantity: Number(v.quantity),
        unitCost: trimToNull(v.unitCost),
        warehouseId: v.warehouseId,
        toWarehouseId: v.type === "TRANSFER" ? (trimToNull(v.toWarehouseId) ?? null) : null,
    };

    const body: CreateMovementRequest = {
        type: v.type,
        date: v.date,
        referenceNumber: trimToNull(v.referenceNumber),
        sourceBillId: source?.billId ?? null,
        sourceInvoiceId: source?.invoiceId ?? null,
        reason: isAdjustment(v.type) ? (v.reason ?? null) : null,
        memo: trimToNull(v.memo),
        lines: [line],
    };

    try {
        await createMovement(body);
    } catch {
        return { ok: false as const, error: "Couldn't post the movement. Try again." };
    }

    revalidatePath("/inventory/movements");
    redirect("/inventory/movements");
};
