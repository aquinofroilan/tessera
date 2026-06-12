import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui";
import { AppTopbar } from "../../../../../_components/AppTopbar";
import { Block } from "../../../../../_components/Block";
import { PageHeader } from "../../../../../_components/PageHeader";
import { listEmployees } from "@/lib/api/hr/employees-dal";
import { getProject } from "@/lib/api/projects/projects-dal";
import { getTask, listTasks } from "@/lib/api/projects/tasks-dal";
import { EditTaskForm } from "../_components/EditTaskForm";
import { ReparentControl } from "../_components/ReparentControl";

type Props = { params: Promise<{ id: string; taskId: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id, taskId } = await params;
    const task = await getTask(id, taskId);
    return { title: task ? `Edit ${task.name} · Tessera` : "Edit task · Tessera" };
};

const EditTaskPage = async ({ params }: Props) => {
    const { id, taskId } = await params;
    const [project, task] = await Promise.all([getProject(id), getTask(id, taskId)]);
    if (!project || !task) notFound();

    const [tasks, employees] = await Promise.all([listTasks(id), listEmployees()]);
    const parentOptions = tasks
        .filter((t) => t.id !== task.id)
        .map((t) => ({ id: t.id, name: t.name }));

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Projects", href: "/projects" },
                    { label: project.name, href: `/projects/${project.id}` },
                    { label: task.name },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow={`Projects · ${project.projectNumber}`}
                        title={
                            <>
                                Edit task<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Status moves with the work. Reparenting is enforced — the backend rejects cycles and cross-project moves."
                    />

                    <Block title="Parent" description="Move the task within the project's WBS.">
                        <Card className="p-5">
                            <ReparentControl
                                projectId={project.id}
                                taskId={task.id}
                                currentParentId={task.parentTaskId}
                                options={parentOptions}
                            />
                        </Card>
                    </Block>

                    <Block title="Details" description="Name, assignee, estimate, and status.">
                        <EditTaskForm
                            projectId={project.id}
                            taskId={task.id}
                            defaultValues={{
                                name: task.name,
                                description: task.description ?? "",
                                assigneeEmployeeId: task.assigneeEmployeeId ?? "",
                                estimatedHours: task.estimatedHours ?? "",
                                status: task.status,
                            }}
                            assignees={employees
                                .filter(
                                    (e) =>
                                        e.status === "ACTIVE" || e.id === task.assigneeEmployeeId,
                                )
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

export default EditTaskPage;
