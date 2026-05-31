"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";

import {
    Button,
    Card,
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
    VARIANT_FORM_DEFAULTS,
    variantFormSchema,
    type VariantFormValues,
} from "../../../_data/variant-form-schema";
import { createVariantAction } from "../_data/create-variant-action";

export const AddVariantForm = ({ itemId }: { itemId: string }) => {
    const form = useForm<VariantFormValues>({
        resolver: zodResolver(variantFormSchema),
        mode: "onBlur",
        defaultValues: VARIANT_FORM_DEFAULTS,
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await createVariantAction(itemId, values);
        if (result && !result.ok) toast.error(result.error);
        else form.reset(VARIANT_FORM_DEFAULTS);
    });

    return (
        <Card className="p-5">
            <Form {...form}>
                <form onSubmit={onSubmit} className="grid items-start gap-4 md:grid-cols-[140px_1fr_140px_140px_auto]">
                    <FormField
                        control={form.control}
                        name="skuSuffix"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">SKU suffix *</Label>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="-L-BLK" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="attributes"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">Attributes *</Label>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="size:L, color:black" {...field} />
                                </FormControl>
                                <FormDescription>Comma-separated key:value pairs.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    <Button
                        type="submit"
                        variant="default"
                        size="sm"
                        className="mt-6"
                        disabled={form.formState.isSubmitting}>
                        <IconPlus stroke={1.8} />
                        Add variant
                    </Button>
                </form>
            </Form>
        </Card>
    );
};
