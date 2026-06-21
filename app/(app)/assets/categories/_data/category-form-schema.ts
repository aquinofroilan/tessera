import { z } from "zod";

export const categoryFormSchema = z.object({
    code: z.string().trim().min(1, "Required").max(32, "Too long"),
    name: z.string().trim().min(1, "Required").max(120, "Too long"),
    description: z.string().trim().max(500, "Too long").optional(),
    defaultUsefulLifeMonths: z
        .string()
        .trim()
        .optional()
        .refine((v) => !v || /^\d+$/.test(v), "Whole number only"),
    defaultSalvageValue: z
        .string()
        .trim()
        .optional()
        .refine((v) => !v || /^\d+(\.\d+)?$/.test(v), "Use a number"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const CATEGORY_FORM_DEFAULTS: CategoryFormValues = {
    code: "",
    name: "",
    description: "",
    defaultUsefulLifeMonths: "60",
    defaultSalvageValue: "",
};
