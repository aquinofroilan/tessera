import type { IsoDate, IsoDateTime } from "../types";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "ON_LEAVE";

export type ClockRequest = {
    employeeId: string;
};

export type RecordAttendanceRequest = {
    employeeId: string;
    workDate: IsoDate;
    clockIn?: IsoDateTime | null;
    clockOut?: IsoDateTime | null;
    status?: AttendanceStatus | null;
    notes?: string | null;
};

export type AttendanceResponse = {
    id: string;
    employeeId: string;
    workDate: IsoDate;
    clockIn: IsoDateTime | null;
    clockOut: IsoDateTime | null;
    workedMinutes: number | null;
    status: AttendanceStatus;
    notes: string | null;
    organizationId: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
