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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Label,
} from "@/components/ui";
import {
    UOM_FORM_DEFAULTS,
    uomFormSchema,
    type UomFormValues,
} from "../../../_data/uom-form-schema";
import { createUomAction } from "../_data/create-uom-action";

export const AddUomForm = () => {
    const form = useForm<UomFormValues>({
        resolver: zodResolver(uomFormSchema),
        mode: "onBlur",
        defaultValues: UOM_FORM_DEFAULTS,
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await createUomAction(values);
        if (result && !result.ok) toast.error(result.error);
        else form.reset(UOM_FORM_DEFAULTS);
    });

    return (
        <Card className="p-5">
            <Form {...form}>
                <form onSubmit={onSubmit} className="grid items-end gap-4 md:grid-cols-[140px_1fr_140px_auto]">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">Code *</Label>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="EA" {...field} />
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
                                    <Input placeholder="Each" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="precision"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">Precision *</Label>
                                </FormLabel>
                                <FormControl>
                                    <Input inputMode="numeric" placeholder="0" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant="default" size="sm" disabled={form.formState.isSubmitting}>
                        <IconPlus stroke={1.8} />
                        Add unit
                    </Button>
                </form>
            </Form>
        </Card>
    );
};
