import "server-only";

import { apiCreate, apiGet, apiList } from "@/lib/api/dal";
import type {
    ProjectBudgetResponse,
    ProjectBudgetVsActualResponse,
    SetProjectBudgetRequest,
} from "./budgets";

const budgetPath = (projectId: string) => `/projects/${projectId}/budget`;

export const setProjectBudget = (
    projectId: string,
    body: SetProjectBudgetRequest,
): Promise<ProjectBudgetResponse> => apiCreate<ProjectBudgetResponse>(budgetPath(projectId), body);

export const listProjectBudgets = (projectId: string): Promise<ProjectBudgetResponse[]> =>
    apiList<ProjectBudgetResponse>(budgetPath(projectId));

export const getProjectBudgetVsActual = (
    projectId: string,
): Promise<ProjectBudgetVsActualResponse> =>
    apiGet<ProjectBudgetVsActualResponse>(`${budgetPath(projectId)}/vs-actual`);
