import { z } from "zod";

export const newVendorSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    contactName: z.string().trim().optional(),
    contactEmail: z.string().trim().email("Invalid email").or(z.literal("")).optional(),
    contactPhone: z.string().trim().optional(),
    paymentTermDays: z
        .string()
        .min(1, "Required")
        .refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0, "Must be 0 or more"),
    defaultExpenseAccountId: z.string().trim().optional(),
});

export type NewVendorValues = z.infer<typeof newVendorSchema>;
