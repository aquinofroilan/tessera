import { z } from "zod";

export const submitSelfLeaveSchema = z
    .object({
        leaveTypeId: z.string().trim().min(1, "Pick a leave type"),
        startDate: z
            .string()
            .trim()
            .min(1, "Start date is required")
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
        endDate: z
            .string()
            .trim()
            .min(1, "End date is required")
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
        reason: z.string().trim().max(500, "Keep the reason under 500 characters").optional(),
    })
    .superRefine((values, ctx) => {
        if (values.startDate && values.endDate && values.endDate < values.startDate) {
            ctx.addIssue({
                code: "custom",
                message: "End date can't be before start date",
                path: ["endDate"],
            });
        }
    });

export type SubmitSelfLeaveValues = z.infer<typeof submitSelfLeaveSchema>;

export const SUBMIT_SELF_LEAVE_DEFAULTS: SubmitSelfLeaveValues = {
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
};
