import { z } from "zod";

const isoDate = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const employeeFormSchema = z.object({
    firstName: z.string().trim().min(1, "Required").max(80, "Too long"),
    lastName: z.string().trim().min(1, "Required").max(80, "Too long"),
    email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
    jobTitle: z.string().trim().max(120, "Too long").optional(),
    departmentId: z.string().trim().optional(),
    hireDate: isoDate,
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export const todayIso = (): string => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

export const employeeFormDefaults = (): EmployeeFormValues => ({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    departmentId: "",
    hireDate: todayIso(),
});

export const employeeUpdateSchema = z.object({
    firstName: z.string().trim().min(1, "Required").max(80, "Too long"),
    lastName: z.string().trim().min(1, "Required").max(80, "Too long"),
    email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
    jobTitle: z.string().trim().max(120, "Too long").optional(),
});

export type EmployeeUpdateValues = z.infer<typeof employeeUpdateSchema>;

export const terminateFormSchema = z.object({
    terminationDate: isoDate,
});

export type TerminateFormValues = z.infer<typeof terminateFormSchema>;
