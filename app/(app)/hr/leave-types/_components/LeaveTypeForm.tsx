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
    leaveTypeFormSchema,
    type LeaveTypeFormValues,
} from "../../_data/leave-type-form-schema";
import { useEntityForm } from "../../_data/use-entity-form";
import { CheckboxFormField, TextFormField } from "../../_components/form-fields";

type Props = {
    defaultValues: LeaveTypeFormValues;
    submitLabel: string;
    lockCode?: boolean;
    action: (values: LeaveTypeFormValues) => Promise<{ ok: false; error: string } | void>;
};

export const LeaveTypeForm = ({ defaultValues, submitLabel, lockCode, action }: Props) => {
    const router = useRouter();
    const { form, onSubmit } = useEntityForm({
        schema: leaveTypeFormSchema,
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
                            placeholder="e.g. PTO"
                            disabled={lockCode}
                        />
                        <TextFormField
                            control={form.control}
                            name="name"
                            label="Name *"
                            placeholder="e.g. Paid time off"
                        />
                        <FormField
                            control={form.control}
                            name="defaultAnnualDays"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Default annual entitlement</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            inputMode="numeric"
                                            min={0}
                                            name={field.name}
                                            ref={field.ref}
                                            onBlur={field.onBlur}
                                            value={field.value ?? 0}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <CheckboxFormField
                            control={form.control}
                            name="paid"
                            label="Paid"
                            description="Unpaid types still consume the entitlement balance, but flag here for reporting and payroll downstream."
                            className="flex flex-row items-start gap-3 space-y-0 md:pt-7"
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
