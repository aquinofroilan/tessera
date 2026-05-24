"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import type { CreateStorageLocationRequest } from "@/lib/api/inventory/storage-locations";
import { createStorageLocation } from "@/lib/api/inventory/storage-locations-dal";
import {
    storageLocationFormSchema,
    type StorageLocationFormValues,
} from "../../../_data/storage-location-form-schema";

const trimToNull = (v: string | undefined): string | null => (v?.trim() ? v.trim() : null);

export const createStorageLocationAction = async (warehouseId: string, values: StorageLocationFormValues) => {
    const parsed = storageLocationFormSchema.safeParse(values);
    if (!parsed.success) return { ok: false as const, error: "Please check the form and try again." };

    const body: CreateStorageLocationRequest = {
        code: parsed.data.code.trim(),
        name: parsed.data.name.trim(),
        parentLocationId: trimToNull(parsed.data.parentLocationId),
    };

    try {
        await createStorageLocation(warehouseId, body);
    } catch {
        return { ok: false as const, error: "Couldn't add the storage location. Try again." };
    }

    revalidatePath(`/inventory/warehouses/${warehouseId}`);
    redirect(`/inventory/warehouses/${warehouseId}`);
};
