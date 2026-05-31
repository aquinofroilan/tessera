"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateItemRequest } from "@/lib/api/inventory/items";
import { createItem } from "@/lib/api/inventory/items-dal";
import { itemFormSchema, type ItemFormValues } from "../../../_data/item-form-schema";

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
