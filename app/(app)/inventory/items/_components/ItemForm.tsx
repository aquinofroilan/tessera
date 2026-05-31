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
    FormDescription,
    FormDivider,
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
import { itemFormSchema, type ItemFormValues } from "../../_data/item-form-schema";

export type UomOption = { code: string; name: string };

type ItemFormProps = {
    defaultValues: ItemFormValues;
    submitLabel: string;
    lockValuationMethod?: boolean;
    uomOptions?: UomOption[];
    action: (values: ItemFormValues) => Promise<{ ok: false; error: string } | void>;
};

export const ItemForm = ({
    defaultValues,
    submitLabel,
    lockValuationMethod,
    uomOptions,
    action,
}: ItemFormProps) => {
    const router = useRouter();
    const form = useForm<ItemFormValues>({
        resolver: zodResolver(itemFormSchema),
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
                    <Label variant="eyebrow" className="mb-1 text-(--muted)">
                        Identification
                    </Label>
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">SKU *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. WID-001" {...field} />
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
                                        <Input placeholder="e.g. Stainless widget — 12mm" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Description</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Optional — visible on bills and invoices" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                <Card className="p-6">
                    <Label variant="eyebrow" className="mb-1 text-(--muted)">
                        Categorization
                    </Label>
                    <div className="grid gap-5 md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="kind"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Kind *</Label>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="STOCK">Stock</SelectItem>
                                            <SelectItem value="SERVICE">Service</SelectItem>
                                            <SelectItem value="NON_STOCK">Non-stock</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="unitOfMeasure"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Unit *</Label>
                                    </FormLabel>
                                    {uomOptions && uomOptions.length > 0 ? (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a unit" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {(field.value && !uomOptions.some((u) => u.code === field.value)
                                                    ? [...uomOptions, { code: field.value, name: "(unrecognized)" }]
                                                    : uomOptions
                                                ).map((uom) => (
                                                    <SelectItem key={uom.code} value={uom.code}>
                                                        {uom.code} — {uom.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <FormControl>
                                            <Input placeholder="EA, KG, BOX" {...field} />
                                        </FormControl>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="valuationMethod"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Valuation *</Label>
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={lockValuationMethod}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="WEIGHTED_AVERAGE">Weighted average</SelectItem>
                                            <SelectItem value="FIFO">FIFO</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {lockValuationMethod && (
                                        <FormDescription>Locked — movements already posted.</FormDescription>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                <Card className="p-6">
                    <Label variant="eyebrow" className="mb-1 text-(--muted)">
                        Pricing
                    </Label>
                    <div className="grid gap-5 md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="salesPrice"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Sales price</Label>
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
                            name="purchaseCost"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Purchase cost</Label>
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
                            name="currencyCode"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Currency</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Defaults to org currency" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormDivider label="Accounting" className="my-5" />

                    <div className="grid gap-5 md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="inventoryAccountId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Inventory account</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. acc_1300" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cogsAccountId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">COGS account</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. acc_5100" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="revenueAccountId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Revenue account</Label>
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

                <Card className="p-6">
                    <Label variant="eyebrow" className="mb-1 text-(--muted)">
                        Reorder
                    </Label>
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="reorderPoint"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Reorder point</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input inputMode="numeric" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormDescription>Trigger a low-stock alert at or below this quantity.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="reorderQuantity"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Reorder quantity</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input inputMode="numeric" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormDescription>Suggested order quantity when low-stock fires.</FormDescription>
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
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
