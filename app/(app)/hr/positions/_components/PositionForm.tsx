"use client";

import { useRouter } from "next/navigation";

import { Button, Card, Form } from "@/components/ui";
import {
    positionFormSchema,
    type PositionFormValues,
} from "../../_data/position-form-schema";
import { useEntityForm } from "../../_data/use-entity-form";
import { SelectFormField, TextFormField } from "../../_components/form-fields";

export type DepartmentOption = { id: string; code: string; name: string };

type Props = {
    defaultValues: PositionFormValues;
    submitLabel: string;
    lockCode?: boolean;
    departments: DepartmentOption[];
    action: (values: PositionFormValues) => Promise<{ ok: false; error: string } | void>;
};

export const PositionForm = ({
    defaultValues,
    submitLabel,
    lockCode,
    departments,
    action,
}: Props) => {
    const router = useRouter();
    const { form, onSubmit } = useEntityForm({
        schema: positionFormSchema,
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
                    <div className="grid gap-5 md:grid-cols-2">
                        <TextFormField
                            control={form.control}
                            name="code"
                            label="Code *"
                            placeholder="e.g. ENG-SR"
                            disabled={lockCode}
                        />
                        <TextFormField
                            control={form.control}
                            name="title"
                            label="Title *"
                            placeholder="e.g. Senior Engineer"
                        />
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
                            name="payGrade"
                            label="Pay grade"
                            placeholder="Optional — e.g. G5"
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
