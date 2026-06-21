import { z } from "zod";

const optionalDecimal = z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\d+(\.\d+)?$/.test(v), "Use a number");

export const disposalFormSchema = z.object({
    assetId: z.string().trim().min(1, "Pick an asset"),
    disposalDate: z
        .string()
        .trim()
        .min(1, "Required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
    disposalType: z.enum(["SALE", "WRITE_OFF", "SCRAP"]),
    proceeds: optionalDecimal,
    gainLossAccountId: z.string().trim().optional(),
    cashAccountId: z.string().trim().optional(),
    notes: z.string().trim().max(1000, "Too long").optional(),
});

export type DisposalFormValues = z.infer<typeof disposalFormSchema>;

export const DISPOSAL_FORM_DEFAULTS: DisposalFormValues = {
    assetId: "",
    disposalDate: "",
    disposalType: "SALE",
    proceeds: "",
    gainLossAccountId: "",
    cashAccountId: "",
    notes: "",
};
