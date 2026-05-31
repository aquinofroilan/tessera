"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    Button,
    Card,
    Checkbox,
    Form,
    FormControl,
    FormDescription,
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

type Props = {
    defaultValues: LeaveTypeFormValues;
    submitLabel: string;
    lockCode?: boolean;
    action: (values: LeaveTypeFormValues) => Promise<{ ok: false; error: string } | void>;
};

export const LeaveTypeForm = ({ defaultValues, submitLabel, lockCode, action }: Props) => {
    const router = useRouter();
    const form = useForm<LeaveTypeFormValues>({
        resolver: zodResolver(leaveTypeFormSchema),
        mode: "onBlur",
        defaultValues,
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await action(values);
        if (result && !result.ok) toast.error(result.error);
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-6">
                <Card className="p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Code *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g. PTO"
                                            disabled={lockCode}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Name *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Paid time off" {...field} />
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
                                            inputMode="numeric"
                                            min={0}
                                            name={field.name}
                                            ref={field.ref}
                                            onBlur={field.onBlur}
                                            value={field.value ?? 0}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormDescription>Days per year, before any adjustments.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="paid"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start gap-3 space-y-0 md:pt-7">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(v) => field.onChange(v === true)}
                                        />
                                    </FormControl>
                                    <div className="grid gap-1">
                                        <FormLabel asChild>
                                            <Label className="font-medium">Paid</Label>
                                        </FormLabel>
                                        <FormDescription>
                                            Unpaid types still consume the entitlement balance, but flag here for
                                            reporting and payroll downstream.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
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
