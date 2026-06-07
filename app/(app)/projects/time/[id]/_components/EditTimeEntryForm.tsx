"use client";

import { Button, Card, Form } from "@/components/ui";
import {
    timeEntryUpdateSchema,
    type TimeEntryUpdateValues,
} from "../../../_data/time-entry-form-schema";
import { useEntityForm } from "../../../../hr/_data/use-entity-form";
import {
    CheckboxFormField,
    SelectFormField,
    TextFormField,
} from "../../../../hr/_components/form-fields";
import { updateTimeEntryAction } from "../_data/update-time-entry-action";

export type EditTaskOption = { id: string; name: string };

type Props = {
    id: string;
    defaultValues: TimeEntryUpdateValues;
    tasks: EditTaskOption[];
};

export const EditTimeEntryForm = ({ id, defaultValues, tasks }: Props) => {
    const { form, onSubmit } = useEntityForm({
        schema: timeEntryUpdateSchema,
        defaultValues,
        action: (values) => updateTimeEntryAction(id, values),
    });

    const taskOptions = tasks.map((t) => ({ value: t.id, label: t.name }));

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-6">
                <Card className="p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <TextFormField
                            control={form.control}
                            name="entryDate"
                            label="Date *"
                            type="date"
                        />
                        <TextFormField
                            control={form.control}
                            name="hours"
                            label="Hours *"
                            inputMode="decimal"
                        />
                        <SelectFormField
                            control={form.control}
                            name="taskId"
                            label="Task"
                            placeholder="Whole project"
                            noneLabel="(whole project)"
                            options={taskOptions}
                            className="gap-1.5 md:col-span-2"
                        />
                        <TextFormField
                            control={form.control}
                            name="rate"
                            label="Rate"
                            inputMode="decimal"
                        />
                        <CheckboxFormField
                            control={form.control}
                            name="billable"
                            label="Billable"
                            className="flex flex-row items-start gap-3 space-y-0 md:pt-2"
                        />
                        <TextFormField
                            control={form.control}
                            name="notes"
                            label="Notes"
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
