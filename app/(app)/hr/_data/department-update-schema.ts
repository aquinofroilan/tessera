import { z } from "zod";

export const departmentUpdateSchema = z.object({
    name: z.string().trim().min(1, "Required").max(120, "Too long"),
    description: z.string().trim().optional(),
});

export type DepartmentUpdateValues = z.infer<typeof departmentUpdateSchema>;
