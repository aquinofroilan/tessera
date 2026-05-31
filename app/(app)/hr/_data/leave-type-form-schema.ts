import { z } from "zod";

export const leaveTypeFormSchema = z.object({
    code: z.string().trim().min(1, "Required").max(32, "Too long"),
    name: z.string().trim().min(1, "Required").max(120, "Too long"),
    paid: z.boolean(),
    defaultAnnualDays: z.number().int("Whole days only").min(0, "Must be zero or positive"),
});

export type LeaveTypeFormValues = z.infer<typeof leaveTypeFormSchema>;

export const LEAVE_TYPE_FORM_DEFAULTS: LeaveTypeFormValues = {
    code: "",
    name: "",
    paid: true,
    defaultAnnualDays: 0,
};

export const leaveTypeUpdateSchema = z.object({
    name: z.string().trim().min(1, "Required").max(120, "Too long"),
    paid: z.boolean(),
    defaultAnnualDays: z.number().int("Whole days only").min(0, "Must be zero or positive"),
});

export type LeaveTypeUpdateValues = z.infer<typeof leaveTypeUpdateSchema>;
