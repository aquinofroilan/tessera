import { z } from "zod";

const optionalDecimal = z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^\d+(\.\d+)?$/.test(v), "Must be a non-negative number");

const positiveQuantity = z
    .string()
    .min(1, "Required")
    .refine((v) => /^\d+(\.\d+)?$/.test(v) && Number(v) > 0, "Must be greater than zero");

const isoDate = z
    .string()
    .min(1, "Required")
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), "Use YYYY-MM-DD");

export const movementFormSchema = z
    .object({
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
    })
    .superRefine((data, ctx) => {
        if (data.type === "RECEIPT" && !data.unitCost?.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["unitCost"],
                message: "Required for receipts.",
            });
        }
        if (data.type === "TRANSFER") {
            const dest = data.toWarehouseId?.trim();
            if (!dest) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["toWarehouseId"],
                    message: "Pick a destination warehouse.",
                });
            } else if (dest === data.warehouseId) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["toWarehouseId"],
                    message: "Source and destination must differ.",
                });
            }
        }
        if ((data.type === "ADJUSTMENT_IN" || data.type === "ADJUSTMENT_OUT") && !data.reason) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["reason"],
                message: "Pick a reason.",
            });
        }
    });

export type MovementFormValues = z.infer<typeof movementFormSchema>;

const today = (): string => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

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
