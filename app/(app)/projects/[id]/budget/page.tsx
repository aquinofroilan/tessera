import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconReportAnalytics } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { getProject } from "@/lib/api/projects/projects-dal";
import { listProjectBudgets } from "@/lib/api/projects/budgets-dal";
import { BudgetEditor } from "./_components/BudgetEditor";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const project = await getProject(id);
    return { title: project ? `Budget · ${project.name} · Tessera` : "Budget · Tessera" };
};

const ProjectBudgetPage = async ({ params }: Props) => {
    const { id } = await params;
    const project = await getProject(id);
    if (!project) notFound();

    const budgets = await listProjectBudgets(id);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Projects", href: "/projects" },
                    { label: project.name, href: `/projects/${project.id}` },
                    { label: "Budget" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow={`Projects · ${project.projectNumber}`}
                        title={
                            <>
                                Budget<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="One target per category. Save individually — each save upserts the row. Variance lives one click away."
                        actions={
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/projects/${project.id}/budget/vs-actual`}>
                                    <IconReportAnalytics stroke={1.8} />
                                    Budget vs actual
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="Targets"
                        description="Labor is what the budget tracks today; material and expense actuals will arrive with the expense module.">
                        <BudgetEditor projectId={project.id} budgets={budgets} />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default ProjectBudgetPage;
