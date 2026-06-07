"use client";

import { Button, Card, Form } from "@/components/ui";
import {
    taskUpdateSchema,
    type TaskUpdateValues,
} from "../../../../_data/task-form-schema";
import { useEntityForm } from "../../../../../hr/_data/use-entity-form";
import { SelectFormField, TextFormField } from "../../../../../hr/_components/form-fields";
import type { AssigneeOption } from "../../_components/TaskForm";
import { updateTaskAction } from "../_data/update-task-action";

type Props = {
    projectId: string;
    taskId: string;
    defaultValues: TaskUpdateValues;
    assignees: AssigneeOption[];
};

const STATUS_OPTIONS = [
    { value: "TODO", label: "To do" },
    { value: "IN_PROGRESS", label: "In progress" },
    { value: "DONE", label: "Done" },
    { value: "CANCELLED", label: "Cancelled" },
];

export const EditTaskForm = ({ projectId, taskId, defaultValues, assignees }: Props) => {
    const { form, onSubmit } = useEntityForm({
        schema: taskUpdateSchema,
        defaultValues,
        action: (values) => updateTaskAction(projectId, taskId, values),
    });

    const assigneeOptions = assignees.map((a) => ({
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
                            className="gap-1.5 md:col-span-2"
                        />
                        <TextFormField
                            control={form.control}
                            name="description"
                            label="Description"
                            className="gap-1.5 md:col-span-2"
                        />
                        <SelectFormField
                            control={form.control}
                            name="assigneeEmployeeId"
                            label="Assignee"
                            placeholder="Unassigned"
                            noneLabel="(unassigned)"
                            options={assigneeOptions}
                        />
                        <TextFormField
                            control={form.control}
                            name="estimatedHours"
                            label="Estimated hours"
                            inputMode="decimal"
                        />
                        <SelectFormField
                            control={form.control}
                            name="status"
                            label="Status *"
                            options={STATUS_OPTIONS}
                            className="gap-1.5 md:col-span-2"
                        />
                    </div>
                </Card>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="default"
                        size="sm"
                        disabled={form.formState.isSubmitting}>
                        Save changes
                    </Button>
                </div>
            </form>
        </Form>
    );
};
