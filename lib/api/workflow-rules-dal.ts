import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    CreateWorkflowRuleRequest,
    UpdateWorkflowRuleRequest,
    WorkflowRuleResponse,
} from "./workflow-rules";

const WORKFLOW_RULES_PATH = "/workflow/rules";

type ListQuery = {
    eventKind?: string;
};

export const listWorkflowRules = (query?: ListQuery): Promise<WorkflowRuleResponse[]> =>
    apiList<WorkflowRuleResponse>(WORKFLOW_RULES_PATH, query);

export const getWorkflowRule = cache(
    (id: string): Promise<WorkflowRuleResponse | null> =>
        apiGetOrNull<WorkflowRuleResponse>(`${WORKFLOW_RULES_PATH}/${id}`),
);

export const createWorkflowRule = (body: CreateWorkflowRuleRequest): Promise<WorkflowRuleResponse> =>
    apiCreate<WorkflowRuleResponse>(WORKFLOW_RULES_PATH, body);

export const updateWorkflowRule = (
    id: string,
    body: UpdateWorkflowRuleRequest,
): Promise<WorkflowRuleResponse> =>
    authed(async () =>
        serverClient.patch<WorkflowRuleResponse>(`${WORKFLOW_RULES_PATH}/${id}`, body, {
            headers: await authHeaders(),
        }),
    );

export const deleteWorkflowRule = (id: string): Promise<void> =>
    authed(async () =>
        serverClient.del<void>(`${WORKFLOW_RULES_PATH}/${id}`, { headers: await authHeaders() }),
    );
