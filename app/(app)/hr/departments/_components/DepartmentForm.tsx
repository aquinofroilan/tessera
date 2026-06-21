"use client";

import { useRouter } from "next/navigation";

import { Button, Card, Form } from "@/components/ui";
import {
    departmentFormSchema,
    type DepartmentFormValues,
} from "../../_data/department-form-schema";
import { useEntityForm } from "../../_data/use-entity-form";
import { SelectFormField, type SelectOption, TextFormField } from "../../_components/form-fields";

type Props = {
    defaultValues: DepartmentFormValues;
    submitLabel: string;
    action: (values: DepartmentFormValues) => Promise<{ ok: false; error: string } | void>;
    parentOptions?: SelectOption[];
};

export const DepartmentForm = ({ defaultValues, submitLabel, action, parentOptions }: Props) => {
    const router = useRouter();
    const { form, onSubmit } = useEntityForm({
        schema: departmentFormSchema,
        defaultValues,
        action,
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-6">
                <Card className="p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <TextFormField
                            control={form.control}
                            name="code"
                            label="Code *"
                            placeholder="e.g. ENG"
                        />
                        <TextFormField
                            control={form.control}
                            name="name"
                            label="Name *"
                            placeholder="e.g. Engineering"
                        />
                        <TextFormField
                            control={form.control}
                            name="description"
                            label="Description"
                            placeholder="Optional — what this team does"
                            className="gap-1.5 md:col-span-2"
                        />
                        {parentOptions && (
                            <SelectFormField
                                control={form.control}
                                name="parentId"
                                label="Reports into"
                                options={parentOptions}
                                placeholder="Top-level (no parent)"
                                noneLabel="Top-level (no parent)"
                                description="The department this one rolls up under in the org chart."
                                className="gap-1.5 md:col-span-2"
                            />
                        )}
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
