import { z } from "zod";

export const warehouseFormSchema = z.object({
    code: z.string().trim().min(1, "Required").max(32, "Too long"),
    name: z.string().trim().min(1, "Required").max(120, "Too long"),
    address: z.string().trim().optional(),
    allowNegativeStock: z.boolean(),
    isDefault: z.boolean(),
});

export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;

export const WAREHOUSE_FORM_DEFAULTS: WarehouseFormValues = {
    code: "",
    name: "",
    address: "",
    allowNegativeStock: false,
    isDefault: false,
};
