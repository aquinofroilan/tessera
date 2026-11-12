export type AttendanceStatus = "PRESENT" | "ABSENT" | "ON_LEAVE";

export type ClockRequest = {
    employeeId: string;
};

export type RecordAttendanceRequest = {
    employeeId: string;
    workDate: string;
    clockIn?: string | null;
    clockOut?: string | null;
    status?: AttendanceStatus | null;
    notes?: string | null;
};

export type AttendanceResponse = {
    id: string;
    employeeId: string;
    workDate: string;
    clockIn: string | null;
    clockOut: string | null;
    workedMinutes: number | null;
    status: AttendanceStatus;
    notes: string | null;
    organizationId: string;
    createdAt: string | null;
    updatedAt: string | null;
};
