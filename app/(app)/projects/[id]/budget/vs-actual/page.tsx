import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui";
import { AppTopbar } from "../../../../_components/AppTopbar";
import { Block } from "../../../../_components/Block";
import { PageHeader } from "../../../../_components/PageHeader";
import { getProject } from "@/lib/api/projects/projects-dal";
import { getProjectBudgetVsActual } from "@/lib/api/projects/budgets-dal";
import { BudgetVsActualTable } from "../_components/BudgetVsActualTable";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const project = await getProject(id);
    return {
        title: project ? `Budget vs actual · ${project.name} · Tessera` : "Budget vs actual · Tessera",
    };
};

const BudgetVsActualPage = async ({ params }: Props) => {
    const { id } = await params;
    const project = await getProject(id);
    if (!project) notFound();

    const data = await getProjectBudgetVsActual(id);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Projects", href: "/projects" },
                    { label: project.name, href: `/projects/${project.id}` },
                    { label: "Budget", href: `/projects/${project.id}/budget` },
                    { label: "vs actual" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow={`Projects · ${project.projectNumber}`}
                        title={
                            <>
                                Budget vs actual<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Variance per category. Labor actual is Σ(hours × rate) over approved time entries. Negative remaining is shown in red."
                    />

                    <Block
                        title="Variance"
                        description="Labor only — material and expense actuals will be wired in once the expense module lands.">
                        <BudgetVsActualTable data={data} />
                    </Block>

                    <Block title="Note">
                        <Card className="p-5">
                            <p className="text-[13px] text-(--ink-soft)">
                                Material and expense actuals currently report as zero because there&apos;s no
                                source feeding them yet. Bills and expense claims will carry a{" "}
                                <code className="font-mono text-[12px]">projectId</code> once the expense
                                management module ships, at which point this report fills in without code
                                change.
                            </p>
                        </Card>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default BudgetVsActualPage;
