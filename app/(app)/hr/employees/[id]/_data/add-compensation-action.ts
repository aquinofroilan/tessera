"use server";

import { revalidatePath } from "next/cache";

import type { CreateEmployeeCompensationRequest } from "@/lib/api/hr/compensation";
import { addCompensation } from "@/lib/api/hr/compensation-dal";
import {
    compensationFormSchema,
    type CompensationFormValues,
} from "../../../_data/compensation-form-schema";

export const addCompensationAction = async (
    employeeId: string,
    values: CompensationFormValues,
) => {
    const parsed = compensationFormSchema.safeParse(values);
    if (!parsed.success) {
        return { ok: false as const, error: "Please check the form and try again." };
    }

    const body: CreateEmployeeCompensationRequest = {
        positionId: parsed.data.positionId?.trim() || null,
        payRate: parsed.data.payRate,
        currency: parsed.data.currency.toUpperCase(),
        payPeriod: parsed.data.payPeriod,
        effectiveDate: parsed.data.effectiveDate,
    };

    try {
        await addCompensation(employeeId, body);
    } catch {
        return { ok: false as const, error: "Couldn't record the compensation. Try again." };
    }

    revalidatePath(`/hr/employees/${employeeId}`);
    return { ok: true as const };
};
