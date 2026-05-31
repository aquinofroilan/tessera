"use server";

import {
    approvePayrollRun,
    cancelPayrollRun,
    payPayrollRun,
} from "@/lib/api/hr/payroll-runs-dal";
import { createTransitionAction } from "../../../_data/create-transition-action";

const revalidate = (id: string) => [`/hr/payroll-runs/${id}`, "/hr/payroll-runs"];

export const approvePayrollRunAction = createTransitionAction({
    call: approvePayrollRun,
    revalidate,
    errorMessage: "Couldn't approve the run. Try again.",
});

export const payPayrollRunAction = createTransitionAction({
    call: payPayrollRun,
    revalidate,
    errorMessage: "Couldn't mark the run paid. Try again.",
});

export const cancelPayrollRunAction = createTransitionAction({
    call: cancelPayrollRun,
    revalidate,
    errorMessage: "Couldn't cancel the run. Try again.",
});
