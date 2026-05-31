"use server";

import { revalidatePath } from "next/cache";

import { deactivateLeaveType } from "@/lib/api/hr/leave-types-dal";

export const deactivateLeaveTypeAction = async (id: string) => {
    try {
        await deactivateLeaveType(id);
    } catch {
        return { ok: false as const, error: "Couldn't deactivate the leave type. Try again." };
    }
    revalidatePath(`/hr/leave-types/${id}`);
    revalidatePath("/hr/leave-types");
    return { ok: true as const };
};
