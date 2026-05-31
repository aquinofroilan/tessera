"use client";

import { useRouter } from "next/navigation";

import { Button, Card, Form, Label } from "@/components/ui";
import {
    employeeFormSchema,
    type EmployeeFormValues,
} from "../../_data/employee-form-schema";
import { useEntityForm } from "../../_data/use-entity-form";
import { SelectFormField, TextFormField } from "../../_components/form-fields";

export type DepartmentOption = { id: string; code: string; name: string };

type Props = {
    defaultValues: EmployeeFormValues;
    submitLabel: string;
    departments: DepartmentOption[];
    action: (values: EmployeeFormValues) => Promise<{ ok: false; error: string } | void>;
};

export const EmployeeForm = ({ defaultValues, submitLabel, departments, action }: Props) => {
    const router = useRouter();
    const { form, onSubmit } = useEntityForm({
        schema: employeeFormSchema,
        defaultValues,
        action,
    });

    const departmentOptions = departments.map((d) => ({
        value: d.id,
        label: `${d.code} · ${d.name}`,
    }));

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-6">
                <Card className="p-6">
                    <Label variant="eyebrow" className="mb-1 text-(--muted)">
                        Identity
                    </Label>
                    <div className="grid gap-5 md:grid-cols-2">
                        <TextFormField control={form.control} name="firstName" label="First name *" />
                        <TextFormField control={form.control} name="lastName" label="Last name *" />
                        <TextFormField
                            control={form.control}
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="optional"
                        />
                        <TextFormField
                            control={form.control}
                            name="jobTitle"
                            label="Job title"
                            placeholder="optional"
                        />
                    </div>
                </Card>

                <Card className="p-6">
                    <Label variant="eyebrow" className="mb-1 text-(--muted)">
                        Placement
                    </Label>
                    <div className="grid gap-5 md:grid-cols-2">
                        <SelectFormField
                            control={form.control}
                            name="departmentId"
                            label="Department"
                            placeholder="Unassigned"
                            noneLabel="(unassigned)"
                            options={departmentOptions}
                        />
                        <TextFormField
                            control={form.control}
                            name="hireDate"
                            label="Hire date *"
                            type="date"
                        />
                    </div>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-2.5">
                    <Button type="button" variant="ghost" size="sm" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="default" size="sm" disabled={form.formState.isSubmitting}>
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
