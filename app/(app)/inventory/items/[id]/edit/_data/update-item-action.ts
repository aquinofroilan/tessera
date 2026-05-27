"use server";

import { runUpdateAction } from "@/lib/api/update-action";
import type { UpdateItemRequest } from "@/lib/api/inventory/items";
import { updateItem } from "@/lib/api/inventory/items-dal";
import { itemFormSchema, type ItemFormValues } from "../../../../_data/item-form-schema";

const trimToNull = (v: string | undefined): string | null => (v?.trim() ? v.trim() : null);
const intOrNull = (v: string | undefined): number | null => (v?.trim() ? Number(v) : null);

export const updateItemAction = async (id: string, values: ItemFormValues) =>
    runUpdateAction<ItemFormValues, UpdateItemRequest>({
        values,
        schema: itemFormSchema,
        revalidate: [`/inventory/items/${id}`, "/inventory/items"],
        redirectTo: `/inventory/items/${id}`,
        errorMessage: "Couldn't save changes. Try again.",
        update: (body) => updateItem(id, body),
        toBody: (v) => ({
            sku: v.sku.trim(),
            name: v.name.trim(),
            description: trimToNull(v.description),
            kind: v.kind,
            unitOfMeasure: v.unitOfMeasure.trim(),
            valuationMethod: v.valuationMethod,
            salesPrice: trimToNull(v.salesPrice),
            purchaseCost: trimToNull(v.purchaseCost),
            inventoryAccountId: trimToNull(v.inventoryAccountId),
            cogsAccountId: trimToNull(v.cogsAccountId),
            revenueAccountId: trimToNull(v.revenueAccountId),
            reorderPoint: intOrNull(v.reorderPoint),
            reorderQuantity: intOrNull(v.reorderQuantity),
            currencyCode: trimToNull(v.currencyCode),
        }),
    });
