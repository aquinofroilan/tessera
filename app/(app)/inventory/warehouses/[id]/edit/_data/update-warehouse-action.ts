"use server";

import { runUpdateAction } from "@/lib/api/update-action";
import type { UpdateWarehouseRequest } from "@/lib/api/inventory/warehouses";
import { updateWarehouse } from "@/lib/api/inventory/warehouses-dal";
import {
    warehouseFormSchema,
    type WarehouseFormValues,
} from "../../../../_data/warehouse-form-schema";

const trimToNull = (v: string | undefined): string | null => (v?.trim() ? v.trim() : null);

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
            address: trimToNull(v.address),
            allowNegativeStock: v.allowNegativeStock,
            isDefault: v.isDefault,
        }),
    });
