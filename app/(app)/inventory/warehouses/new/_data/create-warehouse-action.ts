"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateWarehouseRequest } from "@/lib/api/inventory/warehouses";
import { createWarehouse } from "@/lib/api/inventory/warehouses-dal";
import {
    warehouseFormSchema,
    type WarehouseFormValues,
} from "../../../_data/warehouse-form-schema";

export const createWarehouseAction = async (values: WarehouseFormValues) =>
    runCreateAction<WarehouseFormValues, CreateWarehouseRequest>({
        values,
        schema: warehouseFormSchema,
        path: "/inventory/warehouses",
        errorMessage: "Couldn't create the warehouse. Try again.",
        create: createWarehouse,
        toBody: (v) => ({
            code: v.code.trim(),
            name: v.name.trim(),
            address: v.address?.trim() || null,
            allowNegativeStock: v.allowNegativeStock,
            isDefault: v.isDefault,
        }),
    });
