"use server";

import { revalidatePath } from "next/cache";

import {
    approveLeaveRequest,
    cancelLeaveRequest,
    rejectLeaveRequest,
} from "@/lib/api/hr/leave-requests-dal";

const revalidate = (id: string) => {
    revalidatePath(`/hr/leave-requests/${id}`);
    revalidatePath("/hr/leave-requests");
    revalidatePath("/hr/employees");
};

export const approveLeaveRequestAction = async (id: string) => {
    try {
        await approveLeaveRequest(id);
    } catch {
        return { ok: false as const, error: "Couldn't approve the request. Try again." };
    }
    revalidate(id);
    return { ok: true as const };
};

export const rejectLeaveRequestAction = async (id: string, reason: string) => {
    try {
        await rejectLeaveRequest(id, { reason: reason.trim() || null });
    } catch {
        return { ok: false as const, error: "Couldn't reject the request. Try again." };
    }
    revalidate(id);
    return { ok: true as const };
};

export const cancelLeaveRequestAction = async (id: string) => {
    try {
        await cancelLeaveRequest(id);
    } catch {
        return { ok: false as const, error: "Couldn't cancel the request. Try again." };
    }
    revalidate(id);
    return { ok: true as const };
};
