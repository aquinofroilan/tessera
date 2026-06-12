import type { IsoDateTime } from "./types";

export type WorkflowRuleActionType = "NOTIFY_USER" | "NOTIFY_ROLE";

export type CreateWorkflowRuleRequest = {
    name: string;
    description?: string | null;
    eventKind: string;
    actionType: WorkflowRuleActionType;
    actionTarget: string;
    enabled?: boolean;
};

export type UpdateWorkflowRuleRequest = {
    name?: string | null;
    description?: string | null;
    eventKind?: string | null;
    actionType?: WorkflowRuleActionType | null;
    actionTarget?: string | null;
    enabled?: boolean | null;
};

export type WorkflowRuleResponse = {
    id: string;
    name: string;
    description: string | null;
    eventKind: string;
    actionType: WorkflowRuleActionType;
    actionTarget: string;
    enabled: boolean;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
