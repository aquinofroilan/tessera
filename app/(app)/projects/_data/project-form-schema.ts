import { z } from "zod";

import { PROJECT_BILLING_TYPES, type ProjectBillingType } from "@/lib/api/projects/projects";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

const billingType = z.enum(PROJECT_BILLING_TYPES as readonly [ProjectBillingType, ...ProjectBillingType[]]);

export const todayIso = (): string => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

const endNotBeforeStart = (
    val: { startDate: string; endDate?: string },
    ctx: z.RefinementCtx,
) => {
    if (val.endDate && val.endDate < val.startDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date cannot be before the start date",
            path: ["endDate"],
        });
    }
};

export const projectFormSchema = z
    .object({
        name: z.string().trim().min(1, "Required").max(160, "Too long"),
        description: z.string().trim().max(2000, "Too long").optional(),
        customerId: z.string().trim().optional(),
        managerEmployeeId: z.string().trim().optional(),
        startDate: isoDate,
        endDate: isoDate.or(z.literal("")).optional(),
        billingType,
    })
    .superRefine(endNotBeforeStart);

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const projectFormDefaults = (): ProjectFormValues => ({
    name: "",
    description: "",
    customerId: "",
    managerEmployeeId: "",
    startDate: todayIso(),
    endDate: "",
    billingType: "TIME_AND_MATERIALS",
});

export const projectUpdateSchema = z.object({
    name: z.string().trim().min(1, "Required").max(160, "Too long"),
    description: z.string().trim().max(2000, "Too long").optional(),
    customerId: z.string().trim().optional(),
    managerEmployeeId: z.string().trim().optional(),
    endDate: isoDate.or(z.literal("")).optional(),
    billingType,
});

export type ProjectUpdateValues = z.infer<typeof projectUpdateSchema>;
