"use server";

import {
    assignDepartment,
    placeOnLeave,
    returnFromLeave,
    terminateEmployee,
} from "@/lib/api/hr/employees-dal";
import { createTransitionAction } from "../../../_data/create-transition-action";

const revalidate = (id: string) => [`/hr/employees/${id}`, "/hr/employees"];

export const assignDepartmentAction = createTransitionAction<[departmentId: string | null]>({
    call: (id, departmentId) => assignDepartment(id, departmentId),
    revalidate,
    errorMessage: "Couldn't reassign the department. Try again.",
});

export const placeOnLeaveAction = createTransitionAction({
    call: placeOnLeave,
    revalidate,
    errorMessage: "Couldn't place the employee on leave. Try again.",
});

export const returnFromLeaveAction = createTransitionAction({
    call: returnFromLeave,
    revalidate,
    errorMessage: "Couldn't return the employee from leave. Try again.",
});

const terminate = createTransitionAction<[terminationDate: string]>({
    call: (id, terminationDate) => terminateEmployee(id, { terminationDate }),
    revalidate,
    errorMessage: "Couldn't terminate the employee. Try again.",
});

export const terminateEmployeeAction = async (id: string, terminationDate: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(terminationDate)) {
        return { ok: false as const, error: "Termination date must be YYYY-MM-DD." };
    }
    return terminate(id, terminationDate);
};
