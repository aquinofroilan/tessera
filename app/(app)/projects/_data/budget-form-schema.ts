import { z } from "zod";

import {
    PROJECT_COST_CATEGORIES,
    type ProjectCostCategory,
} from "@/lib/api/projects/budgets";

const category = z.enum(
    PROJECT_COST_CATEGORIES as readonly [ProjectCostCategory, ...ProjectCostCategory[]],
);

const money = z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Use a positive amount with up to 2 decimals");

export const budgetFormSchema = z.object({
    category,
    budgetAmount: money,
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
