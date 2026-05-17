import { z } from "zod";

export const newCustomerSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    contactName: z.string().trim().optional(),
    contactEmail: z.string().trim().email("Invalid email").or(z.literal("")).optional(),
    contactPhone: z.string().trim().optional(),
    paymentTermDays: z
        .string()
        .min(1, "Required")
        .refine((v) => Number.isInteger(Number(v)) && Number(v) >= 0, "Must be 0 or more"),
    defaultRevenueAccountId: z.string().trim().optional(),
});

export type NewCustomerValues = z.infer<typeof newCustomerSchema>;
