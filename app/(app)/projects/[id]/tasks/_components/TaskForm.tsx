"use client";

import { useRouter } from "next/navigation";

import { Button, Card, Form } from "@/components/ui";
import {
    taskFormSchema,
    type TaskFormValues,
} from "../../../_data/task-form-schema";
import { useEntityForm } from "../../../../hr/_data/use-entity-form";
import { SelectFormField, TextFormField } from "../../../../hr/_components/form-fields";

export type ParentTaskOption = { id: string; name: string };
export type AssigneeOption = { id: string; name: string; employeeNumber: string };

type Props = {
    defaultValues: TaskFormValues;
    submitLabel: string;
    parentOptions: ParentTaskOption[];
    assigneeOptions: AssigneeOption[];
    action: (values: TaskFormValues) => Promise<{ ok: false; error: string } | void>;
};

export const TaskForm = ({
    defaultValues,
    submitLabel,
    parentOptions,
    assigneeOptions,
    action,
}: Props) => {
    const router = useRouter();
    const { form, onSubmit } = useEntityForm({
        schema: taskFormSchema,
        defaultValues,
        action,
    });

    const parentSelectOptions = parentOptions.map((p) => ({ value: p.id, label: p.name }));
    const assigneeSelectOptions = assigneeOptions.map((a) => ({
        value: a.id,
        label: `${a.employeeNumber} · ${a.name}`,
    }));

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-6">
                <Card className="p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <TextFormField
                            control={form.control}
                            name="name"
                            label="Name *"
                            placeholder="e.g. Design database schema"
                            className="gap-1.5 md:col-span-2"
                        />
                        <TextFormField
                            control={form.control}
                            name="description"
                            label="Description"
                            placeholder="Optional"
                            className="gap-1.5 md:col-span-2"
                        />
                        <SelectFormField
                            control={form.control}
                            name="parentTaskId"
                            label="Parent task"
                            placeholder="Top level"
                            noneLabel="(top level)"
                            options={parentSelectOptions}
                        />
                        <SelectFormField
                            control={form.control}
                            name="assigneeEmployeeId"
                            label="Assignee"
                            placeholder="Unassigned"
                            noneLabel="(unassigned)"
                            options={assigneeSelectOptions}
                        />
                        <TextFormField
                            control={form.control}
                            name="estimatedHours"
                            label="Estimated hours"
                            placeholder="e.g. 8 or 12.5"
                            inputMode="decimal"
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
