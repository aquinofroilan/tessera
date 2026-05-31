"use client";

import { Button, Form } from "@/components/ui";
import {
    departmentUpdateSchema,
    type DepartmentUpdateValues,
} from "../../../_data/department-update-schema";
import { useEntityForm } from "../../../_data/use-entity-form";
import { TextFormField } from "../../../_components/form-fields";
import { updateDepartmentAction } from "../_data/update-department-action";

type Props = {
    id: string;
    defaultValues: DepartmentUpdateValues;
};

export const EditDepartmentForm = ({ id, defaultValues }: Props) => {
    const { form, onSubmit } = useEntityForm({
        schema: departmentUpdateSchema,
        defaultValues,
        action: (values) => updateDepartmentAction(id, values),
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                    <TextFormField control={form.control} name="name" label="Name *" />
                    <TextFormField control={form.control} name="description" label="Description" />
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
