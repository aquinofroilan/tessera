"use server";

import { revalidatePath } from "next/cache";

import { clockInEmployee, clockOutEmployee } from "@/lib/api/hr/attendance-dal";

export type ClockResult = { ok: true } | { ok: false; error: string };

const wrap = async (call: () => Promise<unknown>, errorMessage: string): Promise<ClockResult> => {
    try {
        await call();
    } catch {
        return { ok: false, error: errorMessage };
    }
    revalidatePath("/hr/attendance");
    return { ok: true };
};

export async function clockInAction(employeeId: string): Promise<ClockResult> {
    return wrap(() => clockInEmployee({ employeeId }), "Couldn't clock in. Try again.");
}

export async function clockOutAction(employeeId: string): Promise<ClockResult> {
    return wrap(() => clockOutEmployee({ employeeId }), "Couldn't clock out. Try again.");
}
