import { z } from "zod";

const decimalString = z
    .string()
    .trim()
    .min(1, "Required")
    .regex(/^\d+(\.\d+)?$/, "Use a number");

export const purchaseRequestLineSchema = z.object({
    productId: z.string().trim().min(1, "Pick a product"),
    quantity: decimalString.refine((v) => Number.parseFloat(v) > 0, "Must be > 0"),
    estimatedUnitCost: z
        .string()
        .trim()
        .optional()
        .refine((v) => !v || /^\d+(\.\d+)?$/.test(v), "Use a number"),
    description: z.string().trim().max(200, "Too long").optional(),
});

export type PurchaseRequestLineValues = z.infer<typeof purchaseRequestLineSchema>;

export const purchaseRequestFormSchema = z.object({
    suggestedVendorId: z.string().trim().optional(),
    warehouseId: z.string().trim().optional(),
    justification: z.string().trim().max(500, "Too long").optional(),
    lines: z.array(purchaseRequestLineSchema).min(1, "Add at least one line"),
});

export type PurchaseRequestFormValues = z.infer<typeof purchaseRequestFormSchema>;

export const PURCHASE_REQUEST_LINE_DEFAULTS: PurchaseRequestLineValues = {
    productId: "",
    quantity: "",
    estimatedUnitCost: "",
    description: "",
};

export const PURCHASE_REQUEST_FORM_DEFAULTS: PurchaseRequestFormValues = {
    suggestedVendorId: "",
    warehouseId: "",
    justification: "",
    lines: [PURCHASE_REQUEST_LINE_DEFAULTS],
};
