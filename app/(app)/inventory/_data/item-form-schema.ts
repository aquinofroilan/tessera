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

export const itemFormSchema = z
    .object({
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
    })
    .superRefine((v, ctx) => {
        if (v.kind === "STOCK" && !v.inventoryAccountId?.trim()) {
            ctx.addIssue({
                code: "custom",
                path: ["inventoryAccountId"],
                message: "Required for STOCK items — needed for journal posting on receipt.",
            });
        }
        if (v.salesPrice?.trim() && !v.revenueAccountId?.trim()) {
            ctx.addIssue({
                code: "custom",
                path: ["revenueAccountId"],
                message: "Required when sales price is set.",
            });
        }
        if (v.kind === "STOCK" && v.salesPrice?.trim() && !v.cogsAccountId?.trim()) {
            ctx.addIssue({
                code: "custom",
                path: ["cogsAccountId"],
                message: "Required for STOCK items with a sales price — needed for COGS posting on issue.",
            });
        }
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
