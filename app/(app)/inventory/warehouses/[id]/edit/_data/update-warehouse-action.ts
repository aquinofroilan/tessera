"use server";

import { runUpdateAction } from "@/lib/api/update-action";
import type { UpdateWarehouseRequest } from "@/lib/api/inventory/warehouses";
import { updateWarehouse } from "@/lib/api/inventory/warehouses-dal";
import {
    warehouseFormSchema,
    type WarehouseFormValues,
} from "../../../../_data/warehouse-form-schema";

export const updateWarehouseAction = async (id: string, values: WarehouseFormValues) =>
    runUpdateAction<WarehouseFormValues, UpdateWarehouseRequest>({
        values,
        schema: warehouseFormSchema,
        revalidate: [`/inventory/warehouses/${id}`, "/inventory/warehouses"],
        redirectTo: `/inventory/warehouses/${id}`,
        errorMessage: "Couldn't save changes. Try again.",
        update: (body) => updateWarehouse(id, body),
        toBody: (v) => ({
            code: v.code.trim(),
            name: v.name.trim(),
            address: v.address?.trim() || null,
            allowNegativeStock: v.allowNegativeStock,
            isDefault: v.isDefault,
        }),
    });
