import { z } from "zod";

const STATUSES = ["PRESENT", "ABSENT", "ON_LEAVE"] as const;

export const recordAttendanceSchema = z
    .object({
        employeeId: z.string().trim().min(1, "Pick an employee"),
        workDate: z
            .string()
            .trim()
            .min(1, "Work date is required")
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
        clockIn: z.string().trim().optional(),
        clockOut: z.string().trim().optional(),
        status: z.enum(STATUSES),
        notes: z.string().trim().max(500, "Keep notes under 500 characters").optional(),
    })
    .superRefine((v, ctx) => {
        if (v.clockIn && v.clockOut && v.clockOut < v.clockIn) {
            ctx.addIssue({
                code: "custom",
                message: "Clock-out can't be before clock-in",
                path: ["clockOut"],
            });
        }
    });

export type RecordAttendanceValues = z.infer<typeof recordAttendanceSchema>;

export const RECORD_ATTENDANCE_DEFAULTS: RecordAttendanceValues = {
    employeeId: "",
    workDate: "",
    clockIn: "",
    clockOut: "",
    status: "PRESENT",
    notes: "",
};
