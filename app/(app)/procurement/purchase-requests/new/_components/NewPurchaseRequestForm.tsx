"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash } from "@tabler/icons-react";
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
import { createPurchaseRequestAction } from "../_data/create-purchase-request-action";
import {
    PURCHASE_REQUEST_FORM_DEFAULTS,
    PURCHASE_REQUEST_LINE_DEFAULTS,
    purchaseRequestFormSchema,
    type PurchaseRequestFormValues,
} from "../_data/create-purchase-request-schema";

type Option = { id: string; label: string };

type Props = {
    products: Option[];
    vendors: Option[];
    warehouses: Option[];
};

export const NewPurchaseRequestForm = ({ products, vendors, warehouses }: Props) => {
    const router = useRouter();
    const form = useForm<PurchaseRequestFormValues>({
        resolver: zodResolver(purchaseRequestFormSchema),
        mode: "onBlur",
        defaultValues: PURCHASE_REQUEST_FORM_DEFAULTS,
    });
    const { fields, append, remove } = useFieldArray({ control: form.control, name: "lines" });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await createPurchaseRequestAction(values);
        if (result && !result.ok) toast.error(result.error);
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-6">
                <Card className="p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="suggestedVendorId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Suggested vendor</Label>
                                    </FormLabel>
                                    <Select value={field.value || ""} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Optional — leave to approver" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {vendors.map((v) => (
                                                <SelectItem key={v.id} value={v.id}>
                                                    {v.label}
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
                            name="warehouseId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Receive at</Label>
                                    </FormLabel>
                                    <Select value={field.value || ""} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Optional" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {warehouses.map((w) => (
                                                <SelectItem key={w.id} value={w.id}>
                                                    {w.label}
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
                            name="justification"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Justification</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Why this is needed" maxLength={500} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                <Card className="grid gap-5 p-6">
                    <div className="flex items-center justify-between">
                        <div className="font-display text-foreground text-lg font-[380]">Lines</div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append(PURCHASE_REQUEST_LINE_DEFAULTS)}>
                            <IconPlus stroke={1.8} />
                            Add line
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="grid gap-3 rounded-md border border-(--rule) bg-(--paper-2) p-4 md:grid-cols-12 md:items-end">
                                <FormField
                                    control={form.control}
                                    name={`lines.${index}.productId`}
                                    render={({ field }) => (
                                        <FormItem className="gap-1.5 md:col-span-5">
                                            <FormLabel asChild>
                                                <Label variant="eyebrow">Product *</Label>
                                            </FormLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pick a product" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {products.map((p) => (
                                                        <SelectItem key={p.id} value={p.id}>
                                                            {p.label}
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
                                    name={`lines.${index}.quantity`}
                                    render={({ field }) => (
                                        <FormItem className="gap-1.5 md:col-span-2">
                                            <FormLabel asChild>
                                                <Label variant="eyebrow">Qty *</Label>
                                            </FormLabel>
                                            <FormControl>
                                                <Input inputMode="decimal" placeholder="0" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`lines.${index}.estimatedUnitCost`}
                                    render={({ field }) => (
                                        <FormItem className="gap-1.5 md:col-span-2">
                                            <FormLabel asChild>
                                                <Label variant="eyebrow">Est. unit</Label>
                                            </FormLabel>
                                            <FormControl>
                                                <Input inputMode="decimal" placeholder="0.00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`lines.${index}.description`}
                                    render={({ field }) => (
                                        <FormItem className="gap-1.5 md:col-span-2">
                                            <FormLabel asChild>
                                                <Label variant="eyebrow">Note</Label>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Optional" maxLength={200} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="md:col-span-1 md:self-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        disabled={fields.length === 1}
                                        onClick={() => remove(index)}
                                        aria-label="Remove line">
                                        <IconTrash className="size-4" stroke={1.6} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="flex flex-wrap items-center justify-end gap-2.5">
                    <Button type="button" variant="ghost" size="sm" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="default" size="sm" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Creating…" : "Create request"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
