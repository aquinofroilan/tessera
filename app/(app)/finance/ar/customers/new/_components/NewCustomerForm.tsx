"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import { newCustomerSchema, type NewCustomerValues } from "../_data/new-customer-schema";
import { createCustomerAction } from "../_data/create-customer-action";

export const NewCustomerForm = () => {
    const router = useRouter();
    const form = useForm<NewCustomerValues>({
        resolver: zodResolver(newCustomerSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
            contactName: "",
            contactEmail: "",
            contactPhone: "",
            paymentTermDays: "30",
            defaultRevenueAccountId: "",
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await createCustomerAction(values);
        if (result && !result.ok) toast.error(result.error);
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-6">
                <Card className="p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Customer name *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Cedar & Co." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Contact name</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Primary contact" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Contact email</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="billing@customer.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contactPhone"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Contact phone</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="+1 555 0100" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="paymentTermDays"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Payment terms (days) *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="number" min={0} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="defaultRevenueAccountId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Default revenue account</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. acc_4000" {...field} />
                                    </FormControl>
                                    <FormMessage />
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
                        Create customer
                    </Button>
                </div>
            </form>
        </Form>
    );
};
