import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const leaveRequestFormSchema = z
    .object({
        employeeId: z.string().min(1, "Required"),
        leaveTypeId: z.string().min(1, "Required"),
        startDate: isoDate,
        endDate: isoDate,
        reason: z.string().trim().max(500, "Too long").optional(),
    })
    .superRefine((data, ctx) => {
        if (data.startDate && data.endDate && data.endDate < data.startDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["endDate"],
                message: "End date must be on or after start date.",
            });
        }
    });

export type LeaveRequestFormValues = z.infer<typeof leaveRequestFormSchema>;

const todayIso = (): string => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const leaveRequestFormDefaults = (employeeId = ""): LeaveRequestFormValues => ({
    employeeId,
    leaveTypeId: "",
    startDate: todayIso(),
    endDate: todayIso(),
    reason: "",
});

export const rejectFormSchema = z.object({
    reason: z.string().trim().max(500, "Too long").optional(),
});

export type RejectFormValues = z.infer<typeof rejectFormSchema>;
