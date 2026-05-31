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
import { warehouseFormSchema, type WarehouseFormValues } from "../../_data/warehouse-form-schema";

type WarehouseFormProps = {
    defaultValues: WarehouseFormValues;
    submitLabel: string;
    action: (values: WarehouseFormValues) => Promise<{ ok: false; error: string } | void>;
};

export const WarehouseForm = ({ defaultValues, submitLabel, action }: WarehouseFormProps) => {
    const router = useRouter();
    const form = useForm<WarehouseFormValues>({
        resolver: zodResolver(warehouseFormSchema),
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
                                        <Input placeholder="e.g. MAIN-DC" {...field} />
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
                                        <Input placeholder="e.g. Main distribution center" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Address</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Optional — street, city, postal code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                <Card className="p-6">
                    <Label variant="eyebrow" className="mb-3 text-(--muted)">
                        Policies
                    </Label>
                    <div className="grid gap-5">
                        <FormField
                            control={form.control}
                            name="allowNegativeStock"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start gap-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(v) => field.onChange(v === true)}
                                        />
                                    </FormControl>
                                    <div className="grid gap-1">
                                        <FormLabel asChild>
                                            <Label className="font-medium">Allow negative stock</Label>
                                        </FormLabel>
                                        <FormDescription>
                                            When enabled, the movement ledger accepts issues that would drive on-hand
                                            below zero. Useful for back-orders or consignment.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isDefault"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start gap-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(v) => field.onChange(v === true)}
                                        />
                                    </FormControl>
                                    <div className="grid gap-1">
                                        <FormLabel asChild>
                                            <Label className="font-medium">Set as default warehouse</Label>
                                        </FormLabel>
                                        <FormDescription>
                                            Movements prefill this warehouse. Only one warehouse can be the default.
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
