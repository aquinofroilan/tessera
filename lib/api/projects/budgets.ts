export type ProjectCostCategory = "LABOR" | "MATERIAL" | "EXPENSE" | "OTHER";

export const PROJECT_COST_CATEGORIES: readonly ProjectCostCategory[] = [
    "LABOR",
    "MATERIAL",
    "EXPENSE",
    "OTHER",
] as const;

export type SetProjectBudgetRequest = {
    category: ProjectCostCategory;
    budgetAmount: string;
    currency?: string | null;
};

export type ProjectBudgetResponse = {
    id: string;
    projectId: string;
    category: ProjectCostCategory;
    budgetAmount: string;
    currency: string | null;
    organizationId: string;
    createdAt: string | null;
    updatedAt: string | null;
};

export type BudgetVarianceLine = {
    category: ProjectCostCategory;
    budgeted: string;
    actual: string;
    remaining: string;
};

export type ProjectBudgetVsActualResponse = {
    projectId: string;
    lines: BudgetVarianceLine[];
    totalBudgeted: string;
    totalActual: string;
    totalRemaining: string;
};
