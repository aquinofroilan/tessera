"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    Button,
    Checkbox,
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
import { updateLeaveTypeAction } from "../_data/update-leave-type-action";

type Props = {
    id: string;
    defaultValues: LeaveTypeUpdateValues;
};

export const EditLeaveTypeForm = ({ id, defaultValues }: Props) => {
    const form = useForm<LeaveTypeUpdateValues>({
        resolver: zodResolver(leaveTypeUpdateSchema),
        mode: "onBlur",
        defaultValues,
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await updateLeaveTypeAction(id, values);
        if (result && !result.ok) toast.error(result.error);
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">Name *</Label>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
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
                    <FormField
                        control={form.control}
                        name="paid"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start gap-3 space-y-0 md:pt-7 md:col-span-2">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(v) => field.onChange(v === true)}
                                    />
                                </FormControl>
                                <FormLabel asChild>
                                    <Label className="font-medium">Paid</Label>
                                </FormLabel>
                            </FormItem>
                        )}
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
