export type SubmitSelfLeaveRequest = {
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    reason?: string | null;
};

export type { EmployeeCompensationResponse } from "./compensation";
export type { EmployeeResponse } from "./employees";
export type { LeaveBalanceResponse, LeaveRequestResponse } from "./leave-requests";
