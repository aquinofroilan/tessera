import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AppTopbar } from "../../../../_components/AppTopbar";
import { Block } from "../../../../_components/Block";
import { PageHeader } from "../../../../_components/PageHeader";
import { getProject } from "@/lib/api/projects/projects-dal";
import { listTasks } from "@/lib/api/projects/tasks-dal";
import { getTimeEntry } from "@/lib/api/projects/time-entries-dal";
import { EditTimeEntryForm } from "../_components/EditTimeEntryForm";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
    title: "Edit time entry · Tessera",
};

const EditTimeEntryPage = async ({ params }: Props) => {
    const { id } = await params;
    const entry = await getTimeEntry(id);
    if (!entry) notFound();
    if (entry.status !== "DRAFT") redirect("/projects/time");

    const [project, tasks] = await Promise.all([
        getProject(entry.projectId),
        listTasks(entry.projectId),
    ]);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Projects", href: "/projects" },
                    { label: "Time", href: "/projects/time" },
                    { label: "Edit" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow={`Projects · ${project?.projectNumber ?? ""}`}
                        title={
                            <>
                                Edit entry<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Only drafts are editable. Submit when ready and approval is the next step."
                    />

                    <Block title="Details">
                        <EditTimeEntryForm
                            id={entry.id}
                            defaultValues={{
                                taskId: entry.taskId ?? "",
                                entryDate: entry.entryDate,
                                hours: entry.hours,
                                billable: entry.billable,
                                rate: entry.rate ?? "",
                                notes: entry.notes ?? "",
                            }}
                            tasks={tasks.map((t) => ({ id: t.id, name: t.name }))}
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default EditTimeEntryPage;
