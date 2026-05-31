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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import type { StorageLocationResponse } from "@/lib/api/inventory/storage-locations";
import {
    STORAGE_LOCATION_FORM_DEFAULTS,
    storageLocationFormSchema,
    type StorageLocationFormValues,
} from "../../../_data/storage-location-form-schema";
import { createStorageLocationAction } from "../_data/create-storage-location-action";

const ROOT_SENTINEL = "__root__";

type AddStorageLocationFormProps = {
    warehouseId: string;
    parents: StorageLocationResponse[];
};

export const AddStorageLocationForm = ({ warehouseId, parents }: AddStorageLocationFormProps) => {
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
                <form
                    onSubmit={onSubmit}
                    className="grid items-end gap-4 md:grid-cols-[120px_1fr_200px_auto]">
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
                    <FormField
                        control={form.control}
                        name="parentLocationId"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">Parent</Label>
                                </FormLabel>
                                <Select
                                    value={field.value || ROOT_SENTINEL}
                                    onValueChange={(v) => field.onChange(v === ROOT_SENTINEL ? "" : v)}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={ROOT_SENTINEL}>(top-level)</SelectItem>
                                        {parents.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.code} · {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
