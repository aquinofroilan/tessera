import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const decimal = z.string().regex(/^\d+(\.\d+)?$/, "Must be a positive decimal");

export const compensationFormSchema = z.object({
    positionId: z.string().trim().optional(),
    payRate: decimal,
    currency: z
        .string()
        .trim()
        .length(3, "Use a 3-letter ISO currency code")
        .regex(/^[A-Za-z]{3}$/, "Letters only"),
    payPeriod: z.enum(["ANNUAL", "MONTHLY", "HOURLY"]),
    effectiveDate: isoDate,
});

export type CompensationFormValues = z.infer<typeof compensationFormSchema>;

const todayIso = (): string => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const compensationFormDefaults = (): CompensationFormValues => ({
    positionId: "",
    payRate: "",
    currency: "USD",
    payPeriod: "MONTHLY",
    effectiveDate: todayIso(),
});
