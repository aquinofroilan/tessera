import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { listEmployees } from "@/lib/api/hr/employees-dal";
import { listProjects } from "@/lib/api/projects/projects-dal";
import { listTasks } from "@/lib/api/projects/tasks-dal";
import { TimeEntryForm } from "../_components/TimeEntryForm";
import { timeEntryFormDefaults } from "../../_data/time-entry-form-schema";
import { createTimeEntryAction } from "./_data/create-time-entry-action";

export const metadata: Metadata = {
    title: "Log time · Tessera",
};

const NewTimeEntryPage = async () => {
    const [employees, projects] = await Promise.all([listEmployees(), listProjects()]);

    const activeProjects = projects.filter(
        (p) => p.status === "ACTIVE" || p.status === "PLANNED",
    );

    const tasksByProjectId = Object.fromEntries(
        await Promise.all(
            activeProjects.map(async (p) => {
                const tasks = await listTasks(p.id);
                return [p.id, tasks.map((t) => ({ id: t.id, name: t.name }))] as const;
            }),
        ),
    );

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Projects", href: "/projects" },
                    { label: "Time", href: "/projects/time" },
                    { label: "Log" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow="Projects · Time"
                        title={
                            <>
                                Log time<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="One entry per day per project per task is the usual shape. Drafts are editable until you submit — after that the approval queue decides."
                    />

                    <Block
                        title="Entry"
                        description="Hours and rate accept decimals up to 4 places.">
                        <TimeEntryForm
                            defaultValues={timeEntryFormDefaults()}
                            submitLabel="Save draft"
                            employees={employees
                                .filter((e) => e.status === "ACTIVE")
                                .map((e) => ({
                                    id: e.id,
                                    name: `${e.firstName} ${e.lastName}`,
                                    employeeNumber: e.employeeNumber,
                                }))}
                            projects={activeProjects.map((p) => ({
                                id: p.id,
                                name: p.name,
                                projectNumber: p.projectNumber,
                            }))}
                            tasksByProjectId={tasksByProjectId}
                            action={createTimeEntryAction}
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default NewTimeEntryPage;
