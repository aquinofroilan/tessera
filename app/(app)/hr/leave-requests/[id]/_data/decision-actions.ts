"use server";

import {
    approveLeaveRequest,
    cancelLeaveRequest,
    rejectLeaveRequest,
} from "@/lib/api/hr/leave-requests-dal";
import { createTransitionAction } from "../../../_data/create-transition-action";

const revalidate = (id: string) => [
    `/hr/leave-requests/${id}`,
    "/hr/leave-requests",
    "/hr/employees",
];

export const approveLeaveRequestAction = createTransitionAction({
    call: approveLeaveRequest,
    revalidate,
    errorMessage: "Couldn't approve the request. Try again.",
});

export const cancelLeaveRequestAction = createTransitionAction({
    call: cancelLeaveRequest,
    revalidate,
    errorMessage: "Couldn't cancel the request. Try again.",
});

export const rejectLeaveRequestAction = createTransitionAction<[reason: string]>({
    call: (id, reason) => rejectLeaveRequest(id, { reason: reason.trim() || null }),
    revalidate,
    errorMessage: "Couldn't reject the request. Try again.",
});
