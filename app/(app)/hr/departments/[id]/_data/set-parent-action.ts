"use server";

import { revalidatePath } from "next/cache";

import { setDepartmentParent } from "@/lib/api/hr/departments-dal";

export type SetParentResult = { ok: true } | { ok: false; error: string };

export const setParentAction = async (id: string, parentId: string | null): Promise<SetParentResult> => {
    try {
        await setDepartmentParent(id, { parentId });
    } catch {
        return { ok: false, error: "Couldn't move the department. Try again." };
    }
    revalidatePath(`/hr/departments/${id}`);
    revalidatePath("/hr/departments");
    revalidatePath("/hr/departments/org-chart");
    return { ok: true };
};
