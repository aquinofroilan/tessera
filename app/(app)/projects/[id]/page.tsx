import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconPencil } from "@tabler/icons-react";

import { Button, Card } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { listCustomers } from "@/lib/api/finance/customers-dal";
import { listEmployees } from "@/lib/api/hr/employees-dal";
import { getProject } from "@/lib/api/projects/projects-dal";
import { ProfileGrid } from "../../hr/_components/ProfileGrid";
import { ProjectStatusBadge } from "../_components/ProjectStatusBadge";
import { LifecycleActions } from "./_components/LifecycleActions";

type Props = { params: Promise<{ id: string }> };

const BILLING_LABEL = {
    TIME_AND_MATERIALS: "Time & materials",
    FIXED_PRICE: "Fixed price",
    MILESTONE: "Milestone",
} as const;

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const project = await getProject(id);
    return { title: project ? `${project.name} · Tessera` : "Project · Tessera" };
};

const ProjectDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const project = await getProject(id);
    if (!project) notFound();

    const [customers, employees] = await Promise.all([listCustomers(), listEmployees()]);
    const customer = project.customerId
        ? customers.find((c) => c.id === project.customerId)
        : undefined;
    const manager = project.managerEmployeeId
        ? employees.find((e) => e.id === project.managerEmployeeId)
        : undefined;

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Projects", href: "/projects" },
                    { label: project.name },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow={`Projects · ${project.projectNumber}`}
                        title={project.name}
                        description={
                            project.description ??
                            "No description yet. The edit screen takes one — short is fine."
                        }
                        actions={
                            <div className="flex flex-wrap items-center gap-2">
                                <ProjectStatusBadge status={project.status} />
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/projects/${project.id}/edit`}>
                                        <IconPencil stroke={1.8} />
                                        Edit
                                    </Link>
                                </Button>
                            </div>
                        }
                    />

                    <Block
                        title="Lifecycle"
                        description="Transitions are guarded — only the moves valid from the current state are shown.">
                        <Card className="p-5">
                            <LifecycleActions id={project.id} status={project.status} />
                        </Card>
                    </Block>

                    <Block
                        title="Profile"
                        description="Customer and manager assignments. Editable from the edit screen.">
                        <ProfileGrid
                            rows={[
                                { label: "Project number", value: project.projectNumber },
                                { label: "Status", value: <ProjectStatusBadge status={project.status} /> },
                                { label: "Billing type", value: BILLING_LABEL[project.billingType] },
                                {
                                    label: "Customer",
                                    value: customer
                                        ? customer.name
                                        : project.customerId
                                          ? "—"
                                          : "Internal",
                                },
                                {
                                    label: "Manager",
                                    value: manager
                                        ? `${manager.employeeNumber} · ${manager.firstName} ${manager.lastName}`
                                        : "Unassigned",
                                },
                                { label: "Start", value: project.startDate },
                                { label: "End", value: project.endDate ?? "—" },
                            ]}
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default ProjectDetailPage;
