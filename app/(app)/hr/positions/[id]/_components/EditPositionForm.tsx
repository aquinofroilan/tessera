"use client";

import { Button, Form } from "@/components/ui";
import {
    positionUpdateSchema,
    type PositionUpdateValues,
} from "../../../_data/position-form-schema";
import { useEntityForm } from "../../../_data/use-entity-form";
import { SelectFormField, TextFormField } from "../../../_components/form-fields";
import type { DepartmentOption } from "../../_components/PositionForm";
import { updatePositionAction } from "../_data/update-position-action";

type Props = {
    id: string;
    defaultValues: PositionUpdateValues;
    departments: DepartmentOption[];
};

export const EditPositionForm = ({ id, defaultValues, departments }: Props) => {
    const { form, onSubmit } = useEntityForm({
        schema: positionUpdateSchema,
        defaultValues,
        action: (values) => updatePositionAction(id, values),
    });

    const departmentOptions = departments.map((d) => ({
        value: d.id,
        label: `${d.code} · ${d.name}`,
    }));

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                    <TextFormField control={form.control} name="title" label="Title *" />
                    <TextFormField control={form.control} name="payGrade" label="Pay grade" />
                    <SelectFormField
                        control={form.control}
                        name="departmentId"
                        label="Department"
                        placeholder="Unassigned"
                        noneLabel="(unassigned)"
                        options={departmentOptions}
                        className="gap-1.5 md:col-span-2"
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" variant="default" size="sm" disabled={form.formState.isSubmitting}>
                        Save changes
                    </Button>
                </div>
            </form>
        </Form>
    );
};
