"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateLeaveTypeRequest } from "@/lib/api/hr/leave-types";
import { createLeaveType } from "@/lib/api/hr/leave-types-dal";
import {
    leaveTypeFormSchema,
    type LeaveTypeFormValues,
} from "../../../_data/leave-type-form-schema";

export const createLeaveTypeAction = async (values: LeaveTypeFormValues) =>
    runCreateAction<LeaveTypeFormValues, CreateLeaveTypeRequest>({
        values,
        schema: leaveTypeFormSchema,
        path: "/hr/leave-types",
        errorMessage: "Couldn't create the leave type. Try again.",
        create: createLeaveType,
        toBody: (v) => ({
            code: v.code.trim(),
            name: v.name.trim(),
            paid: v.paid,
            defaultAnnualDays: v.defaultAnnualDays,
        }),
    });
