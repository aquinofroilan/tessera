import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { WorkflowRuleForm } from "../../_components/WorkflowRuleForm";
import { WORKFLOW_RULE_FORM_DEFAULTS } from "../../_data/workflow-rule-schema";
import { createWorkflowRuleAction } from "./_data/create-rule-action";

export const metadata: Metadata = {
    title: "New workflow rule · Tessera",
};

const NewWorkflowRulePage = () => (
    <>
        <AppTopbar
            crumbs={[
                { label: "Automation" },
                { label: "Workflow rules", href: "/workflow/rules" },
                { label: "New" },
            ]}
        />
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-300 p-9">
                <PageHeader
                    eyebrow="Automation · New rule"
                    title="New workflow rule"
                    description="Fire a notification when a domain event matches the kind you pick."
                />
                <WorkflowRuleForm
                    defaultValues={WORKFLOW_RULE_FORM_DEFAULTS}
                    submitLabel="Create rule"
                    action={createWorkflowRuleAction}
                />
            </div>
        </div>
    </>
);

export default NewWorkflowRulePage;
