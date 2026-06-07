import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

const decimal4 = z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,4})?$/, "Up to 4 decimal places");

const positiveDecimal4 = decimal4.refine((v) => Number(v) > 0, "Must be greater than 0");

const optionalDecimal4 = z
    .string()
    .trim()
    .regex(/^$|^\d+(\.\d{1,4})?$/, "Up to 4 decimal places")
    .optional();

export const todayIso = (): string => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

export const timeEntryFormSchema = z.object({
    employeeId: z.string().trim().min(1, "Required"),
    projectId: z.string().trim().min(1, "Required"),
    taskId: z.string().trim().optional(),
    entryDate: isoDate,
    hours: positiveDecimal4,
    billable: z.boolean(),
    rate: optionalDecimal4,
    notes: z.string().trim().max(1000, "Too long").optional(),
});

export type TimeEntryFormValues = z.infer<typeof timeEntryFormSchema>;

export const timeEntryFormDefaults = (): TimeEntryFormValues => ({
    employeeId: "",
    projectId: "",
    taskId: "",
    entryDate: todayIso(),
    hours: "",
    billable: true,
    rate: "",
    notes: "",
});

export const timeEntryUpdateSchema = z.object({
    taskId: z.string().trim().optional(),
    entryDate: isoDate,
    hours: positiveDecimal4,
    billable: z.boolean(),
    rate: optionalDecimal4,
    notes: z.string().trim().max(1000, "Too long").optional(),
});

export type TimeEntryUpdateValues = z.infer<typeof timeEntryUpdateSchema>;
