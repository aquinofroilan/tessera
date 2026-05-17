"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, parseISO } from "date-fns";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { LineItemsCard } from "../../../../_components/LineItemsCard";
import { MOCK_TODAY } from "../../../../_data/mock-anchor";
import { apVendors, expenseAccounts } from "../../_data/bills-mock";
import { newBillSchema, type NewBillValues } from "../_data/new-bill-schema";
import { createBillAction } from "../_data/create-bill-action";

const defaultDueOffset = 30;
const isoPlusDays = (iso: string, days: number) => format(addDays(parseISO(iso), days), "yyyy-MM-dd");

export const NewBillForm = () => {
    const router = useRouter();
    const form = useForm<NewBillValues>({
        resolver: zodResolver(newBillSchema),
        mode: "onBlur",
        defaultValues: {
            vendorId: "",
            billNumber: "",
            date: MOCK_TODAY,
            dueDate: isoPlusDays(MOCK_TODAY, defaultDueOffset),
            referenceNumber: "",
            currencyCode: "USD",
            lines: [{ accountId: "", description: "", amount: "" }],
        },
    });

    const watchedCurrency = useWatch({ control: form.control, name: "currencyCode" });
    const currency = watchedCurrency || "USD";

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await createBillAction(values);
        if (result && !result.ok) toast.error(result.error);
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-6">
                <Card className="p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="vendorId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Vendor *</Label>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select vendor" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {apVendors.map((v) => (
                                                <SelectItem key={v.id} value={v.id}>
                                                    {v.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="billNumber"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Vendor invoice # *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. WL-44218" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="referenceNumber"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">PO reference</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="PO-…" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="currencyCode"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Currency *</Label>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="USD">USD — US Dollar</SelectItem>
                                            <SelectItem value="EUR">EUR — Euro</SelectItem>
                                            <SelectItem value="GBP">GBP — Pound Sterling</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Bill date *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Due date *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                <LineItemsCard
                    control={form.control}
                    name="lines"
                    accounts={expenseAccounts}
                    description="Each line posts to an expense account."
                    currencyCode={currency}
                />

                <div className="flex flex-wrap items-center justify-end gap-2.5">
                    <Button type="button" variant="ghost" size="sm" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="default" size="sm" disabled={form.formState.isSubmitting}>
                        Save as draft
                    </Button>
                </div>
            </form>
        </Form>
    );
};
