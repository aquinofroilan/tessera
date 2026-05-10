import { z } from "zod";

export const newBillLineSchema = z.object({
    accountId: z.string().min(1, "Required"),
    description: z.string().trim().optional(),
    amount: z
        .string()
        .min(1, "Required")
        .refine((v) => Number(v) > 0, "Must be > 0"),
});

export const newBillSchema = z.object({
    vendorId: z.string().min(1, "Required"),
    billNumber: z.string().trim().min(1, "Required"),
    date: z.string().min(1, "Required"),
    dueDate: z.string().min(1, "Required"),
    referenceNumber: z.string().trim().optional(),
    currencyCode: z.string().min(1, "Required"),
    lines: z.array(newBillLineSchema).min(1, "Add at least one line"),
});

export type NewBillValues = z.infer<typeof newBillSchema>;
