"use client";

import { WorkflowRuleForm } from "../../../_components/WorkflowRuleForm";
import type { WorkflowRuleFormValues } from "../../../_data/workflow-rule-schema";
import { updateWorkflowRuleAction } from "../_data/update-rule-action";

type Props = {
    id: string;
    defaultValues: WorkflowRuleFormValues;
};

export function EditWorkflowRuleForm({ id, defaultValues }: Props) {
    return (
        <WorkflowRuleForm
            defaultValues={defaultValues}
            submitLabel="Save changes"
            action={(values) => updateWorkflowRuleAction(id, values)}
        />
    );
}
