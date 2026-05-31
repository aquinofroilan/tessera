"use client";

import { useMemo } from "react";
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
    compensationFormDefaults,
    compensationFormSchema,
    type CompensationFormValues,
} from "../../../_data/compensation-form-schema";
import { addCompensationAction } from "../_data/add-compensation-action";

const NONE_SENTINEL = "__none__";

type PositionOption = { id: string; code: string; title: string };

type Props = {
    employeeId: string;
    positions: PositionOption[];
};

export const AddCompensationForm = ({ employeeId, positions }: Props) => {
    const defaults = useMemo(() => compensationFormDefaults(), []);
    const form = useForm<CompensationFormValues>({
        resolver: zodResolver(compensationFormSchema),
        mode: "onBlur",
        defaultValues: defaults,
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await addCompensationAction(employeeId, values);
        if (result && !result.ok) toast.error(result.error);
        else {
            toast.success("Compensation recorded.");
            form.reset(compensationFormDefaults());
        }
    });

    return (
        <Form {...form}>
            <Card className="p-6">
                <Label variant="eyebrow" className="mb-3 text-(--muted)">
                    Add compensation
                </Label>
                <form onSubmit={onSubmit} className="grid gap-5">
                    <div className="grid gap-5 md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="payRate"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Pay rate *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            inputMode="decimal"
                                            placeholder="0.00"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Currency *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input maxLength={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="payPeriod"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Period *</Label>
                                    </FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ANNUAL">Annual</SelectItem>
                                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                                            <SelectItem value="HOURLY">Hourly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="effectiveDate"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Effective date *</Label>
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
                            name="positionId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Position</Label>
                                    </FormLabel>
                                    <Select
                                        value={field.value || NONE_SENTINEL}
                                        onValueChange={(v) => field.onChange(v === NONE_SENTINEL ? "" : v)}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Unlinked" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={NONE_SENTINEL}>(unlinked)</SelectItem>
                                            {positions.map((p) => (
                                                <SelectItem key={p.id} value={p.id}>
                                                    {p.code} · {p.title}
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
                            Record compensation
                        </Button>
                    </div>
                </form>
            </Card>
        </Form>
    );
};
