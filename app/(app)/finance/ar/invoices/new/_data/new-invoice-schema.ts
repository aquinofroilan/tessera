import { z } from "zod";

export const newInvoiceLineSchema = z.object({
    accountId: z.string().min(1, "Required"),
    description: z.string().trim().optional(),
    amount: z
        .string()
        .min(1, "Required")
        .refine((v) => Number(v) > 0, "Must be > 0"),
});

export const newInvoiceSchema = z.object({
    customerId: z.string().min(1, "Required"),
    date: z.string().min(1, "Required"),
    dueDate: z.string().min(1, "Required"),
    referenceNumber: z.string().trim().optional(),
    currencyCode: z.string().min(1, "Required"),
    lines: z.array(newInvoiceLineSchema).min(1, "Add at least one line"),
});

export type NewInvoiceValues = z.infer<typeof newInvoiceSchema>;
