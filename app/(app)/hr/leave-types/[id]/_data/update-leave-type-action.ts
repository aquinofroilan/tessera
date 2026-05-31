"use server";

import { runUpdateAction } from "@/lib/api/update-action";
import type { UpdateLeaveTypeRequest } from "@/lib/api/hr/leave-types";
import { updateLeaveType } from "@/lib/api/hr/leave-types-dal";
import {
    leaveTypeUpdateSchema,
    type LeaveTypeUpdateValues,
} from "../../../_data/leave-type-form-schema";

export const updateLeaveTypeAction = async (id: string, values: LeaveTypeUpdateValues) =>
    runUpdateAction<LeaveTypeUpdateValues, UpdateLeaveTypeRequest>({
        values,
        schema: leaveTypeUpdateSchema,
        revalidate: ["/hr/leave-types", `/hr/leave-types/${id}`],
        redirectTo: `/hr/leave-types/${id}`,
        errorMessage: "Couldn't update the leave type. Try again.",
        update: (body) => updateLeaveType(id, body),
        toBody: (v) => ({
            name: v.name.trim(),
            paid: v.paid,
            defaultAnnualDays: v.defaultAnnualDays,
        }),
    });
