import { z } from "zod";

export const uomFormSchema = z.object({
    code: z.string().trim().min(1, "Required").max(16, "Too long"),
    name: z.string().trim().min(1, "Required").max(80, "Too long"),
    precision: z
        .string()
        .min(1, "Required")
        .refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= 6, "0–6 only"),
});

export type UomFormValues = z.infer<typeof uomFormSchema>;

export const UOM_FORM_DEFAULTS: UomFormValues = {
    code: "",
    name: "",
    precision: "0",
};
