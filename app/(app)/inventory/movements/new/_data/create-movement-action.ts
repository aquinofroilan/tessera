"use server";

import { runCreateAction } from "@/lib/api/create-action";
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

export const createMovementAction = async (
    values: MovementFormValues,
    source?: { billId?: string; invoiceId?: string },
) =>
    runCreateAction<MovementFormValues, CreateMovementRequest>({
        values,
        schema: movementFormSchema,
        toBody: (v) => {
            const line: MovementLineRequest = {
                itemId: v.itemId,
                quantity: Number(v.quantity),
                unitCost: v.unitCost?.trim() || null,
                warehouseId: v.warehouseId,
                toWarehouseId: v.type === "TRANSFER" ? v.toWarehouseId?.trim() || null : null,
            };
            return {
                type: v.type,
                date: v.date,
                referenceNumber: v.referenceNumber?.trim() || null,
                sourceBillId: source?.billId ?? null,
                sourceInvoiceId: source?.invoiceId ?? null,
                reason: isAdjustment(v.type) ? v.reason ?? null : null,
                memo: v.memo?.trim() || null,
                lines: [line],
            };
        },
        create: createMovement,
        path: "/inventory/movements",
        errorMessage: "Couldn't post the movement. Try again.",
    });
