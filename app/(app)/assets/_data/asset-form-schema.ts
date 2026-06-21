import { z } from "zod";

const decimalString = z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^\d+(\.\d+)?$/, "Use a number");

const optionalDecimal = z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\d+(\.\d+)?$/.test(v), "Use a number");

export const assetFormSchema = z.object({
    name: z.string().trim().min(1, "Required").max(200, "Too long"),
    description: z.string().trim().max(1000, "Too long").optional(),
    categoryId: z.string().trim().optional(),
    acquisitionDate: z
        .string()
        .trim()
        .min(1, "Required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
    acquisitionCost: decimalString,
    salvageValue: optionalDecimal,
    usefulLifeMonths: z
        .string()
        .trim()
        .min(1, "Required")
        .regex(/^\d+$/, "Whole number only")
        .refine((v) => Number.parseInt(v, 10) > 0, "Must be > 0"),
    location: z.string().trim().max(200, "Too long").optional(),
    serialNumber: z.string().trim().max(100, "Too long").optional(),
    assetAccountId: z.string().trim().optional(),
    accumulatedDepreciationAccountId: z.string().trim().optional(),
    depreciationExpenseAccountId: z.string().trim().optional(),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;

export const ASSET_FORM_DEFAULTS: AssetFormValues = {
    name: "",
    description: "",
    categoryId: "",
    acquisitionDate: "",
    acquisitionCost: "",
    salvageValue: "",
    usefulLifeMonths: "36",
    location: "",
    serialNumber: "",
    assetAccountId: "",
    accumulatedDepreciationAccountId: "",
    depreciationExpenseAccountId: "",
};
