"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    Button,
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
import {
    positionUpdateSchema,
    type PositionUpdateValues,
} from "../../../_data/position-form-schema";
import { updatePositionAction } from "../_data/update-position-action";
import type { DepartmentOption } from "../../_components/PositionForm";

const NONE_SENTINEL = "__none__";

type Props = {
    id: string;
    defaultValues: PositionUpdateValues;
    departments: DepartmentOption[];
};

export const EditPositionForm = ({ id, defaultValues, departments }: Props) => {
    const form = useForm<PositionUpdateValues>({
        resolver: zodResolver(positionUpdateSchema),
        mode: "onBlur",
        defaultValues,
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await updatePositionAction(id, values);
        if (result && !result.ok) toast.error(result.error);
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">Title *</Label>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="payGrade"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">Pay grade</Label>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="departmentId"
                        render={({ field }) => (
                            <FormItem className="gap-1.5 md:col-span-2">
                                <FormLabel asChild>
                                    <Label variant="eyebrow">Department</Label>
                                </FormLabel>
                                <Select
                                    value={field.value || NONE_SENTINEL}
                                    onValueChange={(v) => field.onChange(v === NONE_SENTINEL ? "" : v)}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Unassigned" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={NONE_SENTINEL}>(unassigned)</SelectItem>
                                        {departments.map((d) => (
                                            <SelectItem key={d.id} value={d.id}>
                                                {d.code} · {d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" variant="default" size="sm" disabled={form.formState.isSubmitting}>
                        Save changes
                    </Button>
                </div>
            </form>
        </Form>
    );
};
