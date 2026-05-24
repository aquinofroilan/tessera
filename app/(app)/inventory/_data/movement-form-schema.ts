import { z } from "zod";

const optionalDecimal = z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^-?\d+(\.\d+)?$/.test(v), "Must be a number");

const positiveQuantity = z
    .string()
    .min(1, "Required")
    .refine((v) => /^\d+(\.\d+)?$/.test(v) && Number(v) > 0, "Must be greater than zero");

const isoDate = z
    .string()
    .min(1, "Required")
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), "Use YYYY-MM-DD");

export const movementFormSchema = z.object({
    type: z.enum(["RECEIPT", "ISSUE", "TRANSFER", "ADJUSTMENT_IN", "ADJUSTMENT_OUT"]),
    date: isoDate,
    referenceNumber: z.string().trim().optional(),
    itemId: z.string().min(1, "Required"),
    quantity: positiveQuantity,
    warehouseId: z.string().min(1, "Required"),
    toWarehouseId: z.string().optional(),
    unitCost: optionalDecimal,
    reason: z.enum(["COUNT_CORRECTION", "DAMAGED", "WRITE_OFF", "OTHER"]).optional(),
    memo: z.string().trim().optional(),
});

export type MovementFormValues = z.infer<typeof movementFormSchema>;

const today = (): string => new Date().toISOString().slice(0, 10);

export const movementFormDefaults = (
    type: MovementFormValues["type"],
    prefill?: Partial<MovementFormValues>,
): MovementFormValues => ({
    type,
    date: today(),
    referenceNumber: "",
    itemId: "",
    quantity: "",
    warehouseId: "",
    toWarehouseId: "",
    unitCost: "",
    reason: undefined,
    memo: "",
    ...prefill,
});

export const isAdjustment = (t: MovementFormValues["type"]): boolean =>
    t === "ADJUSTMENT_IN" || t === "ADJUSTMENT_OUT";
