"use client";

import { useRouter } from "next/navigation";

import {
    Button,
    Card,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Label,
} from "@/components/ui";
import {
    projectFormSchema,
    type ProjectFormValues,
} from "../_data/project-form-schema";
import { useEntityForm } from "../../hr/_data/use-entity-form";
import { SelectFormField, TextFormField } from "../../hr/_components/form-fields";

export type CustomerOption = { id: string; name: string };
export type ManagerOption = { id: string; name: string; employeeNumber: string };

type Props = {
    defaultValues: ProjectFormValues;
    submitLabel: string;
    customers: CustomerOption[];
    managers: ManagerOption[];
    action: (values: ProjectFormValues) => Promise<{ ok: false; error: string } | void>;
};

const BILLING_OPTIONS = [
    { value: "TIME_AND_MATERIALS", label: "Time & materials" },
    { value: "FIXED_PRICE", label: "Fixed price" },
    { value: "MILESTONE", label: "Milestone" },
];

export const ProjectForm = ({
    defaultValues,
    submitLabel,
    customers,
    managers,
    action,
}: Props) => {
    const router = useRouter();
    const { form, onSubmit } = useEntityForm({
        schema: projectFormSchema,
        defaultValues,
        action,
    });

    const customerOptions = customers.map((c) => ({ value: c.id, label: c.name }));
    const managerOptions = managers.map((m) => ({
        value: m.id,
        label: `${m.employeeNumber} · ${m.name}`,
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
                            placeholder="e.g. Q3 platform migration"
                            className="gap-1.5 md:col-span-2"
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Description</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="What this project is for. One sentence is plenty."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SelectFormField
                            control={form.control}
                            name="customerId"
                            label="Customer"
                            placeholder="Internal"
                            noneLabel="(internal)"
                            options={customerOptions}
                        />
                        <SelectFormField
                            control={form.control}
                            name="managerEmployeeId"
                            label="Manager"
                            placeholder="Unassigned"
                            noneLabel="(unassigned)"
                            options={managerOptions}
                        />
                        <TextFormField
                            control={form.control}
                            name="startDate"
                            label="Start date *"
                            type="date"
                        />
                        <TextFormField
                            control={form.control}
                            name="endDate"
                            label="End date"
                            type="date"
                        />
                        <SelectFormField
                            control={form.control}
                            name="billingType"
                            label="Billing type *"
                            options={BILLING_OPTIONS}
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
