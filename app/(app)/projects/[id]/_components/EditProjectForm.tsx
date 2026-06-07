"use client";

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
    projectUpdateSchema,
    type ProjectUpdateValues,
} from "../../_data/project-form-schema";
import { useEntityForm } from "../../../hr/_data/use-entity-form";
import { SelectFormField, TextFormField } from "../../../hr/_components/form-fields";
import type { CustomerOption, ManagerOption } from "../../_components/ProjectForm";
import { updateProjectAction } from "../_data/update-project-action";

type Props = {
    id: string;
    defaultValues: ProjectUpdateValues;
    customers: CustomerOption[];
    managers: ManagerOption[];
};

const BILLING_OPTIONS = [
    { value: "TIME_AND_MATERIALS", label: "Time & materials" },
    { value: "FIXED_PRICE", label: "Fixed price" },
    { value: "MILESTONE", label: "Milestone" },
];

export const EditProjectForm = ({ id, defaultValues, customers, managers }: Props) => {
    const { form, onSubmit } = useEntityForm({
        schema: projectUpdateSchema,
        defaultValues,
        action: (values) => updateProjectAction(id, values),
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
                                        <Input {...field} />
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
                            name="endDate"
                            label="End date"
                            type="date"
                            className="gap-1.5 md:col-span-2"
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
