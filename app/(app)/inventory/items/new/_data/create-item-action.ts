"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateItemRequest } from "@/lib/api/inventory/items";
import { createItem } from "@/lib/api/inventory/items-dal";
import { itemFormSchema, type ItemFormValues } from "../../../_data/item-form-schema";

const trimToNull = (v: string | undefined): string | null => (v?.trim() ? v.trim() : null);
const intOrNull = (v: string | undefined): number | null => (v?.trim() ? Number(v) : null);

export const createItemAction = async (values: ItemFormValues) =>
    runCreateAction<ItemFormValues, CreateItemRequest>({
        values,
        schema: itemFormSchema,
        path: "/inventory/items",
        errorMessage: "Couldn't create the item. Try again.",
        create: createItem,
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
