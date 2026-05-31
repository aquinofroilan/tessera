"use server";

import { runUpdateAction } from "@/lib/api/update-action";
import type { UpdateItemRequest } from "@/lib/api/inventory/items";
import { updateItem } from "@/lib/api/inventory/items-dal";
import { itemFormSchema, type ItemFormValues } from "../../../../_data/item-form-schema";

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
            description: v.description?.trim() || null,
            kind: v.kind,
            unitOfMeasure: v.unitOfMeasure.trim(),
            valuationMethod: v.valuationMethod,
            salesPrice: v.salesPrice?.trim() || null,
            purchaseCost: v.purchaseCost?.trim() || null,
            inventoryAccountId: v.inventoryAccountId?.trim() || null,
            cogsAccountId: v.cogsAccountId?.trim() || null,
            revenueAccountId: v.revenueAccountId?.trim() || null,
            reorderPoint: intOrNull(v.reorderPoint),
            reorderQuantity: intOrNull(v.reorderQuantity),
            currencyCode: v.currencyCode?.trim() || null,
        }),
    });
