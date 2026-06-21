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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { assetFormSchema, type AssetFormValues } from "../_data/asset-form-schema";

type Option = { id: string; label: string };

type Props = {
    defaultValues: AssetFormValues;
    submitLabel: string;
    action: (values: AssetFormValues) => Promise<{ ok: false; error: string } | void>;
    categories: Option[];
    accounts: Option[];
    editMode?: boolean;
};

const NONE = "__none__";

export function AssetForm({ defaultValues, submitLabel, action, categories, accounts, editMode = false }: Props) {
    const router = useRouter();
    const form = useForm<AssetFormValues>({
        resolver: zodResolver(assetFormSchema),
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
                            name="name"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Name *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Lathe #1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Category</Label>
                                    </FormLabel>
                                    <Select
                                        value={field.value || NONE}
                                        onValueChange={(v) => field.onChange(v === NONE ? "" : v)}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Uncategorised" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Uncategorised</SelectItem>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.label}
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
                            name="location"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Location</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Building A · Floor 2" maxLength={200} {...field} />
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
                                        <Input placeholder="Optional notes" maxLength={1000} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {!editMode && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="acquisitionDate"
                                    render={({ field }) => (
                                        <FormItem className="gap-1.5">
                                            <FormLabel asChild>
                                                <Label variant="eyebrow">Acquired *</Label>
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
                                    name="usefulLifeMonths"
                                    render={({ field }) => (
                                        <FormItem className="gap-1.5">
                                            <FormLabel asChild>
                                                <Label variant="eyebrow">Useful life (months) *</Label>
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="number" min={1} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="acquisitionCost"
                                    render={({ field }) => (
                                        <FormItem className="gap-1.5">
                                            <FormLabel asChild>
                                                <Label variant="eyebrow">Cost *</Label>
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
                                    name="salvageValue"
                                    render={({ field }) => (
                                        <FormItem className="gap-1.5">
                                            <FormLabel asChild>
                                                <Label variant="eyebrow">Salvage value</Label>
                                            </FormLabel>
                                            <FormControl>
                                                <Input inputMode="decimal" placeholder="0.00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        <FormField
                            control={form.control}
                            name="serialNumber"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Serial #</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Optional" maxLength={100} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                <Card className="grid gap-5 p-6">
                    <div className="grid gap-1">
                        <div className="font-display text-foreground text-lg font-[380]">GL routing</div>
                        <div className="text-[12px] text-(--muted)">
                            Required to post depreciation and disposal. Asset = 1500 series; Accumulated = 1599;
                            Expense = 6900.
                        </div>
                    </div>
                    <div className="grid gap-5 md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="assetAccountId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Asset account</Label>
                                    </FormLabel>
                                    <Select
                                        value={field.value || NONE}
                                        onValueChange={(v) => field.onChange(v === NONE ? "" : v)}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="—" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Not configured</SelectItem>
                                            {accounts.map((a) => (
                                                <SelectItem key={a.id} value={a.id}>
                                                    {a.label}
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
                            name="accumulatedDepreciationAccountId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Accumulated dep</Label>
                                    </FormLabel>
                                    <Select
                                        value={field.value || NONE}
                                        onValueChange={(v) => field.onChange(v === NONE ? "" : v)}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="—" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Not configured</SelectItem>
                                            {accounts.map((a) => (
                                                <SelectItem key={a.id} value={a.id}>
                                                    {a.label}
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
                            name="depreciationExpenseAccountId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Depreciation expense</Label>
                                    </FormLabel>
                                    <Select
                                        value={field.value || NONE}
                                        onValueChange={(v) => field.onChange(v === NONE ? "" : v)}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="—" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Not configured</SelectItem>
                                            {accounts.map((a) => (
                                                <SelectItem key={a.id} value={a.id}>
                                                    {a.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                        {form.formState.isSubmitting ? "Saving…" : submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
