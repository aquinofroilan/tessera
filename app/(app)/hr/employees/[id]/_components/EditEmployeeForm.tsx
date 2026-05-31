"use client";

import { Button, Form } from "@/components/ui";
import {
    employeeUpdateSchema,
    type EmployeeUpdateValues,
} from "../../../_data/employee-form-schema";
import { useEntityForm } from "../../../_data/use-entity-form";
import { TextFormField } from "../../../_components/form-fields";
import { updateEmployeeAction } from "../_data/update-employee-action";

type Props = {
    id: string;
    defaultValues: EmployeeUpdateValues;
};

export const EditEmployeeForm = ({ id, defaultValues }: Props) => {
    const { form, onSubmit } = useEntityForm({
        schema: employeeUpdateSchema,
        defaultValues,
        action: (values) => updateEmployeeAction(id, values),
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                    <TextFormField control={form.control} name="firstName" label="First name *" />
                    <TextFormField control={form.control} name="lastName" label="Last name *" />
                    <TextFormField control={form.control} name="email" label="Email" type="email" />
                    <TextFormField control={form.control} name="jobTitle" label="Job title" />
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
