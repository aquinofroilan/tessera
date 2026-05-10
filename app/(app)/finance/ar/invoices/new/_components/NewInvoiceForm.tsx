"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash } from "@tabler/icons-react";

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
import { formatMoney } from "../../../../_data/format";
import { invoiceCustomers, revenueAccounts } from "../../_data/invoices-mock";
import { newInvoiceSchema, type NewInvoiceValues } from "../_data/new-invoice-schema";

const today = "2026-05-10";
const defaultDueOffset = 30;
const isoPlusDays = (iso: string, days: number) => {
    const d = new Date(iso);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
};

export function NewInvoiceForm() {
    const router = useRouter();
    const form = useForm<NewInvoiceValues>({
        resolver: zodResolver(newInvoiceSchema),
        mode: "onBlur",
        defaultValues: {
            customerId: "",
            date: today,
            dueDate: isoPlusDays(today, defaultDueOffset),
            referenceNumber: "",
            currencyCode: "USD",
            lines: [{ accountId: "", description: "", amount: "" }],
        },
    });

    const lines = useFieldArray({ control: form.control, name: "lines" });
    const watchedLines = useWatch({ control: form.control, name: "lines" });
    const watchedCurrency = useWatch({ control: form.control, name: "currencyCode" });
    const total = (watchedLines ?? []).reduce((sum, line) => sum + (Number(line.amount) || 0), 0);
    const currency = watchedCurrency || "USD";

    const onSubmit = form.handleSubmit(async (values) => {
        console.info("[mock] CreateInvoiceRequest", values);
        router.push("/finance/ar/invoices");
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-6">
                <Card className="p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="customerId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Customer *</Label>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select customer" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {invoiceCustomers.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.name}
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
                            name="referenceNumber"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Reference</Label>
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
                            name="date"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Issue date *</Label>
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
                    </div>
                </Card>

                <Card className="p-0">
                    <div className="flex items-center justify-between border-b border-(--rule-soft) px-6 py-4">
                        <div>
                            <div className="font-display text-[16px] font-medium tracking-[-0.005em] text-(--ink)">
                                Lines
                            </div>
                            <div className="text-[12px] text-(--muted)">Each line posts to a revenue account.</div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => lines.append({ accountId: "", description: "", amount: "" })}>
                            <IconPlus stroke={1.8} />
                            Add line
                        </Button>
                    </div>

                    <div className="flex flex-col">
                        {lines.fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="grid gap-3 border-b border-(--rule-soft) px-6 py-4 last:border-b-0 md:grid-cols-[minmax(220px,1fr)_minmax(0,1.5fr)_140px_36px]">
                                <FormField
                                    control={form.control}
                                    name={`lines.${index}.accountId`}
                                    render={({ field: f }) => (
                                        <FormItem className="gap-1.5">
                                            <FormLabel asChild>
                                                <Label variant="eyebrow">Account *</Label>
                                            </FormLabel>
                                            <Select onValueChange={f.onChange} value={f.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Account" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {revenueAccounts.map((a) => (
                                                        <SelectItem key={a.id} value={a.id}>
                                                            <span className="flex w-full items-center justify-between gap-3">
                                                                <span>{a.name}</span>
                                                                <span className="font-mono text-[10px] tracking-[0.04em] text-(--muted)">
                                                                    {a.code}
                                                                </span>
                                                            </span>
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
                                    name={`lines.${index}.description`}
                                    render={({ field: f }) => (
                                        <FormItem className="gap-1.5">
                                            <FormLabel asChild>
                                                <Label variant="eyebrow">Description</Label>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="What's this line for?" {...f} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`lines.${index}.amount`}
                                    render={({ field: f }) => (
                                        <FormItem className="gap-1.5">
                                            <FormLabel asChild>
                                                <Label variant="eyebrow">Amount *</Label>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    className="text-right tabular-nums"
                                                    {...f}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-end pb-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        aria-label={`Remove line ${index + 1}`}
                                        disabled={lines.fields.length === 1}
                                        onClick={() => lines.remove(index)}>
                                        <IconTrash stroke={1.8} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end gap-6 border-t border-(--rule) px-6 py-4">
                        <span className="font-mono text-[10px] tracking-[0.16em] text-(--muted) uppercase">Total</span>
                        <span className="font-display text-[20px] font-[380] tracking-[-0.01em] text-(--ink) tabular-nums">
                            {formatMoney(total.toFixed(2), currency)}
                        </span>
                    </div>
                </Card>

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
}
