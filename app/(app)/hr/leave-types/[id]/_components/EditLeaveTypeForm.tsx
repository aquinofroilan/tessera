"use client";

import {
    Button,
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
    leaveTypeUpdateSchema,
    type LeaveTypeUpdateValues,
} from "../../../_data/leave-type-form-schema";
import { useEntityForm } from "../../../_data/use-entity-form";
import { CheckboxFormField, TextFormField } from "../../../_components/form-fields";
import { updateLeaveTypeAction } from "../_data/update-leave-type-action";

type Props = {
    id: string;
    defaultValues: LeaveTypeUpdateValues;
};

export const EditLeaveTypeForm = ({ id, defaultValues }: Props) => {
    const { form, onSubmit } = useEntityForm({
        schema: leaveTypeUpdateSchema,
        defaultValues,
        action: (values) => updateLeaveTypeAction(id, values),
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                    <TextFormField control={form.control} name="name" label="Name *" />
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
                        className="flex flex-row items-start gap-3 space-y-0 md:pt-7 md:col-span-2"
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
