import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const payrollRunFormSchema = z
    .object({
        periodStart: isoDate,
        periodEnd: isoDate,
        payDate: isoDate,
    })
    .superRefine((data, ctx) => {
        if (data.periodEnd < data.periodStart) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["periodEnd"],
                message: "Period end must be on or after period start.",
            });
        }
        if (data.payDate < data.periodEnd) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["payDate"],
                message: "Pay date is usually on or after the period end.",
            });
        }
    });

export type PayrollRunFormValues = z.infer<typeof payrollRunFormSchema>;

const isoToday = (): string => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const monthBounds = (): { start: string; end: string; pay: string } => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0);
    const pay = new Date(y, m + 1, 5);
    const fmt = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { start: fmt(start), end: fmt(end), pay: fmt(pay) };
};

export const payrollRunFormDefaults = (): PayrollRunFormValues => {
    const { start, end, pay } = monthBounds();
    return { periodStart: start, periodEnd: end, payDate: pay };
};

export const todayIso = isoToday;
