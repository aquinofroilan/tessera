"use server";

import { revalidatePath } from "next/cache";

import { updateWorkflowRule } from "@/lib/api/workflow-rules-dal";

import {
    workflowRuleFormSchema,
    type WorkflowRuleFormValues,
} from "../../../_data/workflow-rule-schema";

export type UpdateRuleResult = { ok: false; error: string };

export async function updateWorkflowRuleAction(
    id: string,
    values: WorkflowRuleFormValues,
): Promise<UpdateRuleResult | void> {
    const parsed = workflowRuleFormSchema.safeParse(values);
    if (!parsed.success) {
        return { ok: false, error: "Please check the form and try again." };
    }
    try {
        await updateWorkflowRule(id, {
            name: parsed.data.name,
            description: parsed.data.description?.trim() || null,
            eventKind: parsed.data.eventKind,
            actionType: parsed.data.actionType,
            actionTarget: parsed.data.actionTarget,
            enabled: parsed.data.enabled,
        });
    } catch {
        return { ok: false, error: "Couldn't save the rule. Try again." };
    }
    revalidatePath("/workflow/rules");
    revalidatePath(`/workflow/rules/${id}`);
}
