import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppTopbar } from "../../../../_components/AppTopbar";
import { Block } from "../../../../_components/Block";
import { PageHeader } from "../../../../_components/PageHeader";
import { listEmployees } from "@/lib/api/hr/employees-dal";
import { getProject } from "@/lib/api/projects/projects-dal";
import { listTasks } from "@/lib/api/projects/tasks-dal";
import { TaskForm } from "../_components/TaskForm";
import { taskFormDefaults } from "../../../_data/task-form-schema";
import { createTaskAction } from "./_data/create-task-action";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
    title: "New task · Tessera",
};

const NewTaskPage = async ({ params }: Props) => {
    const { id } = await params;
    const project = await getProject(id);
    if (!project) notFound();

    const [tasks, employees] = await Promise.all([listTasks(id), listEmployees()]);

    const action = async (values: Parameters<typeof createTaskAction>[1]) =>
        createTaskAction(id, values);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Projects", href: "/projects" },
                    { label: project.name, href: `/projects/${project.id}` },
                    { label: "New task" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow={`Projects · ${project.projectNumber}`}
                        title={
                            <>
                                New task<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Tasks belong to a project. Nest under a parent for sub-work; leave the parent blank for top-level."
                    />

                    <Block title="Details" description="Status starts at TODO and moves with the work.">
                        <TaskForm
                            defaultValues={taskFormDefaults()}
                            submitLabel="Create task"
                            parentOptions={tasks.map((t) => ({ id: t.id, name: t.name }))}
                            assigneeOptions={employees
                                .filter((e) => e.status === "ACTIVE")
                                .map((e) => ({
                                    id: e.id,
                                    name: `${e.firstName} ${e.lastName}`,
                                    employeeNumber: e.employeeNumber,
                                }))}
                            action={action}
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default NewTaskPage;
