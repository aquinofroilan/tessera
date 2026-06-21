"use server";

import { runCreateAction, type CreateActionResult } from "@/lib/api/create-action";
import type { CreateWorkflowRuleRequest } from "@/lib/api/workflow-rules";
import { createWorkflowRule } from "@/lib/api/workflow-rules-dal";

import {
    workflowRuleFormSchema,
    type WorkflowRuleFormValues,
} from "../../../_data/workflow-rule-schema";

export async function createWorkflowRuleAction(
    values: WorkflowRuleFormValues,
): Promise<CreateActionResult | void> {
    return runCreateAction<WorkflowRuleFormValues, CreateWorkflowRuleRequest>({
        values,
        schema: workflowRuleFormSchema,
        path: "/workflow/rules",
        errorMessage: "Couldn't create the rule. Try again.",
        create: createWorkflowRule,
        toBody: (v) => ({
            name: v.name,
            description: v.description?.trim() || null,
            eventKind: v.eventKind,
            actionType: v.actionType,
            actionTarget: v.actionTarget,
            enabled: v.enabled,
        }),
    });
}
