"use server";

import { runCreateAction, type CreateActionResult } from "@/lib/api/create-action";
import type { RecordAttendanceRequest } from "@/lib/api/hr/attendance";
import { recordAttendance } from "@/lib/api/hr/attendance-dal";

import { recordAttendanceSchema, type RecordAttendanceValues } from "./record-attendance-schema";

const toIsoDateTime = (date: string, time: string | undefined): string | null => {
    if (!time) return null;
    return `${date}T${time.length === 5 ? `${time}:00` : time}`;
};

export const recordAttendanceAction = async (
    values: RecordAttendanceValues,
): Promise<CreateActionResult | void> =>
    runCreateAction<RecordAttendanceValues, RecordAttendanceRequest>({
        values,
        schema: recordAttendanceSchema,
        path: "/hr/attendance",
        errorMessage: "Couldn't save the record. Try again.",
        create: recordAttendance,
        toBody: (v) => ({
            employeeId: v.employeeId,
            workDate: v.workDate,
            clockIn: toIsoDateTime(v.workDate, v.clockIn),
            clockOut: toIsoDateTime(v.workDate, v.clockOut),
            status: v.status,
            notes: v.notes?.trim() ? v.notes.trim() : null,
        }),
    });
