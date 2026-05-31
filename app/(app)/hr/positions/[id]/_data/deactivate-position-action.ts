"use server";

import { revalidatePath } from "next/cache";

import { deactivatePosition } from "@/lib/api/hr/positions-dal";

export const deactivatePositionAction = async (id: string) => {
    try {
        await deactivatePosition(id);
    } catch {
        return { ok: false as const, error: "Couldn't deactivate the position. Try again." };
    }
    revalidatePath(`/hr/positions/${id}`);
    revalidatePath("/hr/positions");
    return { ok: true as const };
};
