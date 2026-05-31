"use server";

import { runCreateAction } from "@/lib/api/create-action";
import type { CreateLeaveRequestRequest } from "@/lib/api/hr/leave-requests";
import { createLeaveRequest } from "@/lib/api/hr/leave-requests-dal";
import {
    leaveRequestFormSchema,
    type LeaveRequestFormValues,
} from "../../../_data/leave-request-form-schema";

export const createLeaveRequestAction = async (values: LeaveRequestFormValues) =>
    runCreateAction<LeaveRequestFormValues, CreateLeaveRequestRequest>({
        values,
        schema: leaveRequestFormSchema,
        path: "/hr/leave-requests",
        errorMessage: "Couldn't file the leave request. Try again.",
        create: createLeaveRequest,
        toBody: (v) => ({
            employeeId: v.employeeId,
            leaveTypeId: v.leaveTypeId,
            startDate: v.startDate,
            endDate: v.endDate,
            reason: v.reason?.trim() || null,
        }),
    });
