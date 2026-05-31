"use server";

import { revalidatePath } from "next/cache";

import { updateWarehouse } from "@/lib/api/inventory/warehouses-dal";

export const setWarehouseActiveAction = async (id: string, isActive: boolean) => {
    try {
        await updateWarehouse(id, { isActive });
    } catch {
        return { ok: false as const, error: "Couldn't update the warehouse status. Try again." };
    }
    revalidatePath(`/inventory/warehouses/${id}`);
    revalidatePath("/inventory/warehouses");
    return { ok: true as const };
};
