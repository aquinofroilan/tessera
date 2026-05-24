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
    STORAGE_LOCATION_FORM_DEFAULTS,
    storageLocationFormSchema,
    type StorageLocationFormValues,
} from "../../../_data/storage-location-form-schema";
import { createStorageLocationAction } from "../_data/create-storage-location-action";

type AddStorageLocationFormProps = {
    warehouseId: string;
};

export const AddStorageLocationForm = ({ warehouseId }: AddStorageLocationFormProps) => {
    const form = useForm<StorageLocationFormValues>({
        resolver: zodResolver(storageLocationFormSchema),
        mode: "onBlur",
        defaultValues: STORAGE_LOCATION_FORM_DEFAULTS,
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await createStorageLocationAction(warehouseId, values);
        if (result && !result.ok) toast.error(result.error);
        else form.reset(STORAGE_LOCATION_FORM_DEFAULTS);
    });

    return (
        <Card className="p-5">
            <Form {...form}>
                <form onSubmit={onSubmit} className="grid items-end gap-4 md:grid-cols-[160px_1fr_auto]">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">Code *</Label>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="A-12" {...field} />
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
                                    <Input placeholder="Aisle A, bin 12" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant="default" size="sm" disabled={form.formState.isSubmitting}>
                        <IconPlus stroke={1.8} />
                        Add location
                    </Button>
                </form>
            </Form>
        </Card>
    );
};
