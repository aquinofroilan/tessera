"use server";

import { revalidatePath } from "next/cache";

import {
    assignDepartment,
    placeOnLeave,
    returnFromLeave,
    terminateEmployee,
} from "@/lib/api/hr/employees-dal";

const revalidateEmployee = (id: string) => {
    revalidatePath(`/hr/employees/${id}`);
    revalidatePath("/hr/employees");
};

export const assignDepartmentAction = async (id: string, departmentId: string | null) => {
    try {
        await assignDepartment(id, departmentId);
    } catch {
        return { ok: false as const, error: "Couldn't reassign the department. Try again." };
    }
    revalidateEmployee(id);
    return { ok: true as const };
};

export const placeOnLeaveAction = async (id: string) => {
    try {
        await placeOnLeave(id);
    } catch {
        return { ok: false as const, error: "Couldn't place the employee on leave. Try again." };
    }
    revalidateEmployee(id);
    return { ok: true as const };
};

export const returnFromLeaveAction = async (id: string) => {
    try {
        await returnFromLeave(id);
    } catch {
        return { ok: false as const, error: "Couldn't return the employee from leave. Try again." };
    }
    revalidateEmployee(id);
    return { ok: true as const };
};

export const terminateEmployeeAction = async (id: string, terminationDate: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(terminationDate)) {
        return { ok: false as const, error: "Termination date must be YYYY-MM-DD." };
    }
    try {
        await terminateEmployee(id, { terminationDate });
    } catch {
        return { ok: false as const, error: "Couldn't terminate the employee. Try again." };
    }
    revalidateEmployee(id);
    return { ok: true as const };
};
