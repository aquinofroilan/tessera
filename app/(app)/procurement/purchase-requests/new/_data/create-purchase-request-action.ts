"use server";

import { runCreateAction, type CreateActionResult } from "@/lib/api/create-action";
import type { CreatePurchaseRequestRequest } from "@/lib/api/procurement/purchase-requests";
import { createPurchaseRequest } from "@/lib/api/procurement/purchase-requests-dal";

import {
    purchaseRequestFormSchema,
    type PurchaseRequestFormValues,
} from "./create-purchase-request-schema";

const blankToNull = (value: string | undefined | null): string | null => {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
};

export const createPurchaseRequestAction = async (
    values: PurchaseRequestFormValues,
): Promise<CreateActionResult | void> =>
    runCreateAction<PurchaseRequestFormValues, CreatePurchaseRequestRequest>({
        values,
        schema: purchaseRequestFormSchema,
        path: "/procurement/purchase-requests",
        errorMessage: "Couldn't create the purchase request. Try again.",
        create: createPurchaseRequest,
        toBody: (v) => ({
            suggestedVendorId: blankToNull(v.suggestedVendorId),
            warehouseId: blankToNull(v.warehouseId),
            justification: blankToNull(v.justification),
            lines: v.lines.map((line) => ({
                productId: line.productId,
                quantity: line.quantity,
                estimatedUnitCost: blankToNull(line.estimatedUnitCost ?? ""),
                description: blankToNull(line.description ?? ""),
            })),
        }),
    });
