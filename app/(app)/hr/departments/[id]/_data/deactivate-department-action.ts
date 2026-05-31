"use server";

import { revalidatePath } from "next/cache";

import { deactivateDepartment } from "@/lib/api/hr/departments-dal";

export const deactivateDepartmentAction = async (id: string) => {
    try {
        await deactivateDepartment(id);
    } catch {
        return { ok: false as const, error: "Couldn't deactivate the department. Try again." };
    }
    revalidatePath(`/hr/departments/${id}`);
    revalidatePath("/hr/departments");
    return { ok: true as const };
};
