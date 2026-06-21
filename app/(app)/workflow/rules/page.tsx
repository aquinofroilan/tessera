import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { requirePermission } from "@/lib/auth/permissions";
import { listWorkflowRules } from "@/lib/api/workflow-rules-dal";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { WorkflowRulesTable } from "./_components/WorkflowRulesTable";

export const metadata: Metadata = {
    title: "Workflow rules · Tessera",
    description: "Route domain events to the people who should hear about them.",
};

const WorkflowRulesPage = async () => {
    await requirePermission("workflow:manage");
    const rules = await listWorkflowRules();
    const enabled = rules.filter((r) => r.enabled).length;

    return (
        <>
            <AppTopbar crumbs={[{ label: "Automation" }, { label: "Workflow rules" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Automation"
                        title={
                            <>
                                Workflow rules<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="When a domain event matches, fan a notification out to the user or role you pick."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/workflow/rules/new">
                                    <IconPlus stroke={1.8} />
                                    New rule
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="All rules"
                        description={`${rules.length} total — ${enabled} enabled.`}>
                        <WorkflowRulesTable rows={rules} detailHrefBase="/workflow/rules" />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default WorkflowRulesPage;
