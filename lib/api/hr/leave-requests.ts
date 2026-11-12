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
    startDate: string;
    endDate: string;
    reason?: string | null;
};

export type RejectLeaveRequestRequest = {
    reason?: string | null;
};

export type LeaveRequestResponse = {
    id: string;
    employeeId: string;
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    days: number;
    reason: string | null;
    status: LeaveRequestStatus;
    decisionReason: string | null;
    decidedBy: string | null;
    decidedAt: string | null;
    organizationId: string;
    requestedBy: string;
    createdAt: string | null;
    updatedAt: string | null;
};

export type LeaveBalanceResponse = {
    employeeId: string;
    leaveTypeId: string;
    year: number;
    entitlementDays: number;
    usedDays: number;
    remainingDays: number;
};
