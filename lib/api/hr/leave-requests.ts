import type { IsoDate, IsoDateTime } from "../types";

export type LeaveRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export const LEAVE_REQUEST_STATUSES: readonly LeaveRequestStatus[] = [
    "PENDING",
    "APPROVED",
    "REJECTED",
    "CANCELLED",
] as const;

export type CreateLeaveRequestRequest = {
    employeeId: string;
    leaveTypeId: string;
    startDate: IsoDate;
    endDate: IsoDate;
    reason?: string | null;
};

export type RejectLeaveRequestRequest = {
    reason?: string | null;
};

export type LeaveRequestResponse = {
    id: string;
    employeeId: string;
    leaveTypeId: string;
    startDate: IsoDate;
    endDate: IsoDate;
    days: number;
    reason: string | null;
    status: LeaveRequestStatus;
    decisionReason: string | null;
    decidedBy: string | null;
    decidedAt: IsoDateTime | null;
    organizationId: string;
    requestedBy: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};

export type LeaveBalanceResponse = {
    employeeId: string;
    leaveTypeId: string;
    year: number;
    entitlementDays: number;
    usedDays: number;
    remainingDays: number;
};
