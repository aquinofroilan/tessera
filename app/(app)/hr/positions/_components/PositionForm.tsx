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
import {
    positionFormSchema,
    type PositionFormValues,
} from "../../_data/position-form-schema";
import { NONE_SENTINEL } from "../../_data/select-sentinels";

export type DepartmentOption = { id: string; code: string; name: string };

type Props = {
    defaultValues: PositionFormValues;
    submitLabel: string;
    lockCode?: boolean;
    departments: DepartmentOption[];
    action: (values: PositionFormValues) => Promise<{ ok: false; error: string } | void>;
};

export const PositionForm = ({
    defaultValues,
    submitLabel,
    lockCode,
    departments,
    action,
}: Props) => {
    const router = useRouter();
    const form = useForm<PositionFormValues>({
        resolver: zodResolver(positionFormSchema),
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
                            name="code"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Code *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. ENG-SR" disabled={lockCode} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Title *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Senior Engineer" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="departmentId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
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
                        <FormField
                            control={form.control}
                            name="payGrade"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Pay grade</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Optional — e.g. G5" {...field} />
                                    </FormControl>
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
