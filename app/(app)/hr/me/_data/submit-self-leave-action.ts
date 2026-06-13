"use server";

import { runCreateAction, type CreateActionResult } from "@/lib/api/create-action";
import { submitMyLeave } from "@/lib/api/hr/self-service-dal";

import { submitSelfLeaveSchema, type SubmitSelfLeaveValues } from "./submit-self-leave-schema";

export const submitSelfLeaveAction = async (values: SubmitSelfLeaveValues): Promise<CreateActionResult | void> =>
    runCreateAction({
        values,
        schema: submitSelfLeaveSchema,
        path: "/hr/me",
        errorMessage: "Couldn't submit the request. Try again.",
        create: submitMyLeave,
        toBody: (v) => ({
            leaveTypeId: v.leaveTypeId,
            startDate: v.startDate,
            endDate: v.endDate,
            reason: v.reason?.trim() ? v.reason.trim() : null,
        }),
    });
