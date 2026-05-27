import { z } from "zod";

const optionalDecimal = z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\d+(\.\d+)?$/.test(v), "Must be 0 or more");

const optionalNonNegativeInt = z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || (Number.isInteger(Number(v)) && Number(v) >= 0), "Must be 0 or more");

export const itemFormSchema = z.object({
    sku: z.string().trim().min(1, "Required").max(64, "Too long"),
    name: z.string().trim().min(1, "Required").max(200, "Too long"),
    description: z.string().trim().optional(),
    kind: z.enum(["STOCK", "SERVICE", "NON_STOCK"]),
    unitOfMeasure: z.string().trim().min(1, "Required").max(16, "Too long"),
    valuationMethod: z.enum(["WEIGHTED_AVERAGE", "FIFO"]),
    salesPrice: optionalDecimal,
    purchaseCost: optionalDecimal,
    inventoryAccountId: z.string().trim().optional(),
    cogsAccountId: z.string().trim().optional(),
    revenueAccountId: z.string().trim().optional(),
    reorderPoint: optionalNonNegativeInt,
    reorderQuantity: optionalNonNegativeInt,
    currencyCode: z.string().trim().optional(),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;

export const ITEM_FORM_DEFAULTS: ItemFormValues = {
    sku: "",
    name: "",
    description: "",
    kind: "STOCK",
    unitOfMeasure: "EA",
    valuationMethod: "WEIGHTED_AVERAGE",
    salesPrice: "",
    purchaseCost: "",
    inventoryAccountId: "",
    cogsAccountId: "",
    revenueAccountId: "",
    reorderPoint: "",
    reorderQuantity: "",
    currencyCode: "",
};
