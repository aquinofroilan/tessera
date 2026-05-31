"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateStorageLocationRequest } from "@/lib/api/inventory/storage-locations";
import { createStorageLocation } from "@/lib/api/inventory/storage-locations-dal";
import {
    storageLocationFormSchema,
    type StorageLocationFormValues,
} from "../../../_data/storage-location-form-schema";

export const createStorageLocationAction = async (warehouseId: string, values: StorageLocationFormValues) =>
    runCreateAction<StorageLocationFormValues, CreateStorageLocationRequest>({
        values,
        schema: storageLocationFormSchema,
        toBody: (data) => ({
            code: data.code.trim(),
            name: data.name.trim(),
            parentLocationId: data.parentLocationId?.trim() || null,
        }),
        create: (body) => createStorageLocation(warehouseId, body),
        path: `/inventory/warehouses/${warehouseId}`,
        errorMessage: "Couldn't add the storage location. Try again.",
    });
