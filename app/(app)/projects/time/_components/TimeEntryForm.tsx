"use client";

import { useRouter } from "next/navigation";

import { Button, Card, Form } from "@/components/ui";
import {
    timeEntryFormSchema,
    type TimeEntryFormValues,
} from "../../_data/time-entry-form-schema";
import { useEntityForm } from "../../../hr/_data/use-entity-form";
import {
    CheckboxFormField,
    SelectFormField,
    TextFormField,
} from "../../../hr/_components/form-fields";

export type EmployeeOption = { id: string; name: string; employeeNumber: string };
export type ProjectOption = { id: string; name: string; projectNumber: string };
export type TaskOption = { id: string; name: string };

type Props = {
    defaultValues: TimeEntryFormValues;
    submitLabel: string;
    employees: EmployeeOption[];
    projects: ProjectOption[];
    tasksByProjectId: Record<string, TaskOption[]>;
    action: (values: TimeEntryFormValues) => Promise<{ ok: false; error: string } | void>;
};

export const TimeEntryForm = ({
    defaultValues,
    submitLabel,
    employees,
    projects,
    tasksByProjectId,
    action,
}: Props) => {
    const router = useRouter();
    const { form, onSubmit } = useEntityForm({
        schema: timeEntryFormSchema,
        defaultValues,
        action,
    });

    const employeeOptions = employees.map((e) => ({
        value: e.id,
        label: `${e.employeeNumber} · ${e.name}`,
    }));
    const projectOptions = projects.map((p) => ({
        value: p.id,
        label: `${p.projectNumber} · ${p.name}`,
    }));
    const selectedProjectId = form.watch("projectId");
    const taskOptions = (tasksByProjectId[selectedProjectId] ?? []).map((t) => ({
        value: t.id,
        label: t.name,
    }));

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-6">
                <Card className="p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <SelectFormField
                            control={form.control}
                            name="employeeId"
                            label="Employee *"
                            placeholder="Pick an employee"
                            options={employeeOptions}
                        />
                        <TextFormField
                            control={form.control}
                            name="entryDate"
                            label="Date *"
                            type="date"
                        />
                        <SelectFormField
                            control={form.control}
                            name="projectId"
                            label="Project *"
                            placeholder="Pick a project"
                            options={projectOptions}
                            className="gap-1.5 md:col-span-2"
                        />
                        <SelectFormField
                            control={form.control}
                            name="taskId"
                            label="Task"
                            placeholder={selectedProjectId ? "Whole project" : "Pick a project first"}
                            noneLabel="(whole project)"
                            options={taskOptions}
                            className="gap-1.5 md:col-span-2"
                        />
                        <TextFormField
                            control={form.control}
                            name="hours"
                            label="Hours *"
                            placeholder="e.g. 4 or 4.5"
                            inputMode="decimal"
                        />
                        <TextFormField
                            control={form.control}
                            name="rate"
                            label="Rate"
                            placeholder="Optional — set for billable lines"
                            inputMode="decimal"
                        />
                        <CheckboxFormField
                            control={form.control}
                            name="billable"
                            label="Billable"
                            description="Approved billable lines are pulled into T&M invoices."
                            className="flex flex-row items-start gap-3 space-y-0 md:col-span-2 md:pt-2"
                        />
                        <TextFormField
                            control={form.control}
                            name="notes"
                            label="Notes"
                            placeholder="What you did. Short is fine."
                            className="gap-1.5 md:col-span-2"
                        />
                    </div>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-2.5">
                    <Button type="button" variant="ghost" size="sm" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="default"
                        size="sm"
                        disabled={form.formState.isSubmitting}>
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
