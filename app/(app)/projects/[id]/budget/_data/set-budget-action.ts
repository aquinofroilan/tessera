"use server";

import { revalidatePath } from "next/cache";

import type {
    ProjectCostCategory,
    SetProjectBudgetRequest,
} from "@/lib/api/projects/budgets";
import { setProjectBudget } from "@/lib/api/projects/budgets-dal";
import { budgetFormSchema } from "../../../_data/budget-form-schema";

type Result = { ok: true } | { ok: false; error: string };

export const setBudgetAction = async (
    projectId: string,
    category: ProjectCostCategory,
    budgetAmount: string,
): Promise<Result> => {
    const parsed = budgetFormSchema.safeParse({ category, budgetAmount });
    if (!parsed.success) {
        return { ok: false, error: "Amount must be positive with up to 2 decimals." };
    }

    const body: SetProjectBudgetRequest = {
        category: parsed.data.category,
        budgetAmount: parsed.data.budgetAmount,
    };

    try {
        await setProjectBudget(projectId, body);
    } catch {
        return { ok: false, error: "Couldn't save the budget. Try again." };
    }

    revalidatePath(`/projects/${projectId}/budget`);
    revalidatePath(`/projects/${projectId}/budget/vs-actual`);
    return { ok: true };
};
