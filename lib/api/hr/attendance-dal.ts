import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    AttendanceResponse,
    ClockRequest,
    RecordAttendanceRequest,
} from "./attendance";

const ATTENDANCE_PATH = "/hr/attendance";

type ListAttendanceQuery = {
    employeeId?: string;
    from?: string;
    to?: string;
};

export const listAttendance = (query?: ListAttendanceQuery): Promise<AttendanceResponse[]> =>
    apiList<AttendanceResponse>(ATTENDANCE_PATH, query);

export const getAttendance = cache(
    (id: string): Promise<AttendanceResponse | null> =>
        apiGetOrNull<AttendanceResponse>(`${ATTENDANCE_PATH}/${id}`),
);

export const clockInEmployee = (body: ClockRequest): Promise<AttendanceResponse> =>
    authed(async () =>
        serverClient.post<AttendanceResponse>(`${ATTENDANCE_PATH}/clock-in`, body, {
            headers: await authHeaders(),
        }),
    );

export const clockOutEmployee = (body: ClockRequest): Promise<AttendanceResponse> =>
    authed(async () =>
        serverClient.post<AttendanceResponse>(`${ATTENDANCE_PATH}/clock-out`, body, {
            headers: await authHeaders(),
        }),
    );

export const recordAttendance = (body: RecordAttendanceRequest): Promise<AttendanceResponse> =>
    apiCreate<AttendanceResponse>(ATTENDANCE_PATH, body);
