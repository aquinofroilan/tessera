import { z } from "zod";

export const positionFormSchema = z.object({
    code: z.string().trim().min(1, "Required").max(32, "Too long"),
    title: z.string().trim().min(1, "Required").max(120, "Too long"),
    departmentId: z.string().trim().optional(),
    payGrade: z.string().trim().max(32, "Too long").optional(),
});

export type PositionFormValues = z.infer<typeof positionFormSchema>;

export const POSITION_FORM_DEFAULTS: PositionFormValues = {
    code: "",
    title: "",
    departmentId: "",
    payGrade: "",
};

export const positionUpdateSchema = z.object({
    title: z.string().trim().min(1, "Required").max(120, "Too long"),
    departmentId: z.string().trim().optional(),
    payGrade: z.string().trim().max(32, "Too long").optional(),
});

export type PositionUpdateValues = z.infer<typeof positionUpdateSchema>;
