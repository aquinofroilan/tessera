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
import { newVendorSchema, type NewVendorValues } from "../_data/new-vendor-schema";
import { createVendorAction } from "../_data/create-vendor-action";

export const NewVendorForm = () => {
    const router = useRouter();
    const form = useForm<NewVendorValues>({
        resolver: zodResolver(newVendorSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
            contactName: "",
            contactEmail: "",
            contactPhone: "",
            paymentTermDays: "30",
            defaultExpenseAccountId: "",
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await createVendorAction(values);
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
                                        <Label variant="eyebrow">Vendor name *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Westline Hardwoods" {...field} />
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
                                        <Input type="email" placeholder="orders@vendor.com" {...field} />
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
                            name="defaultExpenseAccountId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Default expense account</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. acc_5000" {...field} />
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
                        Create vendor
                    </Button>
                </div>
            </form>
        </Form>
    );
};
