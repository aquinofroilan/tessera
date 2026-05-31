"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreatePayrollRunRequest } from "@/lib/api/hr/payroll-runs";
import { createPayrollRun } from "@/lib/api/hr/payroll-runs-dal";
import {
    payrollRunFormSchema,
    type PayrollRunFormValues,
} from "../../../_data/payroll-run-form-schema";

export const createPayrollRunAction = async (values: PayrollRunFormValues) =>
    runCreateAction<PayrollRunFormValues, CreatePayrollRunRequest>({
        values,
        schema: payrollRunFormSchema,
        path: "/hr/payroll-runs",
        errorMessage: "Couldn't create the payroll run. Try again.",
        create: createPayrollRun,
        toBody: (v) => ({
            periodStart: v.periodStart,
            periodEnd: v.periodEnd,
            payDate: v.payDate,
        }),
    });
