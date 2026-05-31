"use server";

import { revalidatePath } from "next/cache";

import { updateItem } from "@/lib/api/inventory/items-dal";

export const setItemStatusAction = async (id: string, status: "ACTIVE" | "ARCHIVED") => {
    try {
        await updateItem(id, { status });
    } catch {
        return { ok: false as const, error: "Couldn't update the item status. Try again." };
    }
    revalidatePath(`/inventory/items/${id}`);
    revalidatePath("/inventory/items");
    return { ok: true as const };
};
