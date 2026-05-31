"use server";

import { revalidatePath } from "next/cache";

import {
    approvePayrollRun,
    cancelPayrollRun,
    payPayrollRun,
} from "@/lib/api/hr/payroll-runs-dal";

const revalidate = (id: string) => {
    revalidatePath(`/hr/payroll-runs/${id}`);
    revalidatePath("/hr/payroll-runs");
};

export const approvePayrollRunAction = async (id: string) => {
    try {
        await approvePayrollRun(id);
    } catch {
        return { ok: false as const, error: "Couldn't approve the run. Try again." };
    }
    revalidate(id);
    return { ok: true as const };
};

export const payPayrollRunAction = async (id: string) => {
    try {
        await payPayrollRun(id);
    } catch {
        return { ok: false as const, error: "Couldn't mark the run paid. Try again." };
    }
    revalidate(id);
    return { ok: true as const };
};

export const cancelPayrollRunAction = async (id: string) => {
    try {
        await cancelPayrollRun(id);
    } catch {
        return { ok: false as const, error: "Couldn't cancel the run. Try again." };
    }
    revalidate(id);
    return { ok: true as const };
};
