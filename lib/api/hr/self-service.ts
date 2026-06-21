import type { EmployeeCompensationResponse } from "./compensation";
import type { EmployeeResponse } from "./employees";
import type { LeaveBalanceResponse, LeaveRequestResponse } from "./leave-requests";

type IsoDate = string;

export type SubmitSelfLeaveRequest = {
    leaveTypeId: string;
    startDate: IsoDate;
    endDate: IsoDate;
    reason?: string | null;
};

export type {
    EmployeeResponse,
    EmployeeCompensationResponse,
    LeaveBalanceResponse,
    LeaveRequestResponse,
};
