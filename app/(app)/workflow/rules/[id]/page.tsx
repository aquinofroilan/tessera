import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getWorkflowRule } from "@/lib/api/workflow-rules-dal";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { DeleteRuleButton } from "./_components/DeleteRuleButton";
import { EditWorkflowRuleForm } from "./_components/EditWorkflowRuleForm";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const rule = await getWorkflowRule(id);
    return { title: rule ? `${rule.name} · Tessera` : "Workflow rule · Tessera" };
};

const WorkflowRuleDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const rule = await getWorkflowRule(id);
    if (!rule) notFound();

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Automation" },
                    { label: "Workflow rules", href: "/workflow/rules" },
                    { label: rule.name },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow="Automation · Workflow rule"
                        title={rule.name}
                        description={rule.description ?? "Edit the rule, or disable / delete it."}
                        actions={<DeleteRuleButton id={rule.id} />}
                    />

                    <Block
                        title="Edit rule"
                        description="Changing the kind, action type, or target updates immediately on save.">
                        <EditWorkflowRuleForm
                            id={rule.id}
                            defaultValues={{
                                name: rule.name,
                                description: rule.description ?? "",
                                eventKind: rule.eventKind,
                                actionType: rule.actionType,
                                actionTarget: rule.actionTarget,
                                enabled: rule.enabled,
                            }}
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default WorkflowRuleDetailPage;
