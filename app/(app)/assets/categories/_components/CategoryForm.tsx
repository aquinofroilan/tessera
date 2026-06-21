"use client";

import { useState } from "react";
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Label,
} from "@/components/ui";
import {
    categoryFormSchema,
    type CategoryFormValues,
} from "../_data/category-form-schema";

type Props = {
    defaultValues: CategoryFormValues;
    submitLabel: string;
    action: (values: CategoryFormValues, isActive: boolean) => Promise<{ ok: false; error: string } | void>;
    initialActive?: boolean;
    showActiveToggle?: boolean;
};

export function CategoryForm({
    defaultValues,
    submitLabel,
    action,
    initialActive = true,
    showActiveToggle = false,
}: Props) {
    const router = useRouter();
    const [isActive, setIsActive] = useState(initialActive);
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categoryFormSchema),
        mode: "onBlur",
        defaultValues,
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await action(values, isActive);
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
                                        <Input placeholder="e.g. MACH" maxLength={32} {...field} />
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
                                        <Input placeholder="e.g. Machinery" maxLength={120} {...field} />
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
                                        <Input placeholder="Optional" maxLength={500} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="defaultUsefulLifeMonths"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Default useful life (months)</Label>
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
                            name="defaultSalvageValue"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Default salvage</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input inputMode="decimal" placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                {showActiveToggle && (
                    <Card className="p-6">
                        <div className="flex items-center gap-2.5">
                            <Checkbox
                                checked={isActive}
                                onCheckedChange={(v) => setIsActive(v === true)}
                            />
                            <span className="text-[13px] text-(--ink-soft)">
                                Active — new assets can be assigned to this category.
                            </span>
                        </div>
                    </Card>
                )}

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
