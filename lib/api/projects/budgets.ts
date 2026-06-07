import type { IsoDateTime, Money } from "../types";

export type ProjectCostCategory = "LABOR" | "MATERIAL" | "EXPENSE" | "OTHER";

export const PROJECT_COST_CATEGORIES: readonly ProjectCostCategory[] = [
    "LABOR",
    "MATERIAL",
    "EXPENSE",
    "OTHER",
] as const;

export type SetProjectBudgetRequest = {
    category: ProjectCostCategory;
    budgetAmount: Money;
    currency?: string | null;
};

export type ProjectBudgetResponse = {
    id: string;
    projectId: string;
    category: ProjectCostCategory;
    budgetAmount: Money;
    currency: string | null;
    organizationId: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};

export type BudgetVarianceLine = {
    category: ProjectCostCategory;
    budgeted: Money;
    actual: Money;
    remaining: Money;
};

export type ProjectBudgetVsActualResponse = {
    projectId: string;
    lines: BudgetVarianceLine[];
    totalBudgeted: Money;
    totalActual: Money;
    totalRemaining: Money;
};
