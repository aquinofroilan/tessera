import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { listCustomers } from "@/lib/api/finance/customers-dal";
import { listEmployees } from "@/lib/api/hr/employees-dal";
import { getProject } from "@/lib/api/projects/projects-dal";
import { EditProjectForm } from "../_components/EditProjectForm";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const project = await getProject(id);
    return { title: project ? `Edit ${project.name} · Tessera` : "Edit project · Tessera" };
};

const EditProjectPage = async ({ params }: Props) => {
    const { id } = await params;
    const project = await getProject(id);
    if (!project) notFound();

    const [customers, employees] = await Promise.all([listCustomers(), listEmployees()]);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Projects", href: "/projects" },
                    { label: project.name, href: `/projects/${project.id}` },
                    { label: "Edit" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow={`Projects · ${project.projectNumber}`}
                        title={
                            <>
                                Edit project<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Number and start date are immutable. Everything else is fair game."
                    />

                    <Block title="Details" description="Updates take effect immediately.">
                        <EditProjectForm
                            id={project.id}
                            defaultValues={{
                                name: project.name,
                                description: project.description ?? "",
                                customerId: project.customerId ?? "",
                                managerEmployeeId: project.managerEmployeeId ?? "",
                                endDate: project.endDate ?? "",
                                billingType: project.billingType,
                            }}
                            customers={customers
                                .filter((c) => c.isActive || c.id === project.customerId)
                                .map((c) => ({ id: c.id, name: c.name }))}
                            managers={employees
                                .filter((e) => e.status === "ACTIVE" || e.id === project.managerEmployeeId)
                                .map((e) => ({
                                    id: e.id,
                                    name: `${e.firstName} ${e.lastName}`,
                                    employeeNumber: e.employeeNumber,
                                }))}
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default EditProjectPage;
