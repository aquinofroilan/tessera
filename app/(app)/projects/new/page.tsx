import type { Metadata } from "next";

import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { listCustomers } from "@/lib/api/finance/customers-dal";
import { listEmployees } from "@/lib/api/hr/employees-dal";
import { ProjectForm } from "../_components/ProjectForm";
import { projectFormDefaults } from "../_data/project-form-schema";
import { createProjectAction } from "./_data/create-project-action";

export const metadata: Metadata = {
    title: "New project · Tessera",
    description: "Set up a project. Naming, billing type, and dates can be revised later.",
};

const NewProjectPage = async () => {
    const [customers, employees] = await Promise.all([listCustomers(), listEmployees()]);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Projects", href: "/projects" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow="Projects"
                        title={
                            <>
                                New project<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Pick a name and a billing posture. Everything else — manager, customer, end date — can be left blank for now and filled in once the work takes shape."
                    />

                    <Block
                        title="Basics"
                        description="A project starts in PLANNED. Activate it when work begins.">
                        <ProjectForm
                            defaultValues={projectFormDefaults()}
                            submitLabel="Create project"
                            customers={customers
                                .filter((c) => c.isActive)
                                .map((c) => ({ id: c.id, name: c.name }))}
                            managers={employees
                                .filter((e) => e.status === "ACTIVE")
                                .map((e) => ({
                                    id: e.id,
                                    name: `${e.firstName} ${e.lastName}`,
                                    employeeNumber: e.employeeNumber,
                                }))}
                            action={createProjectAction}
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default NewProjectPage;
