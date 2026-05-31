"use client";

import type { ComponentProps, ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
    Checkbox,
    FormControl,
    FormDescription,
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
import { NONE_SENTINEL } from "../_data/select-sentinels";

type BaseProps<TFieldValues extends FieldValues> = {
    control: Control<TFieldValues>;
    name: FieldPath<TFieldValues>;
    label: string;
    className?: string;
};

type TextFormFieldProps<TFieldValues extends FieldValues> = BaseProps<TFieldValues> &
    Pick<ComponentProps<typeof Input>, "type" | "placeholder" | "disabled" | "maxLength" | "inputMode" | "min">;

export const TextFormField = <TFieldValues extends FieldValues>({
    control,
    name,
    label,
    className,
    ...inputProps
}: TextFormFieldProps<TFieldValues>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className={className ?? "gap-1.5"}>
                <FormLabel asChild>
                    <Label variant="eyebrow">{label}</Label>
                </FormLabel>
                <FormControl>
                    <Input {...inputProps} {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);

export type SelectOption = { value: string; label: string };

type SelectFormFieldProps<TFieldValues extends FieldValues> = BaseProps<TFieldValues> & {
    options: SelectOption[];
    placeholder?: string;
    noneLabel?: string;
    description?: ReactNode;
};

export const SelectFormField = <TFieldValues extends FieldValues>({
    control,
    name,
    label,
    className,
    options,
    placeholder,
    noneLabel,
    description,
}: SelectFormFieldProps<TFieldValues>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className={className ?? "gap-1.5"}>
                <FormLabel asChild>
                    <Label variant="eyebrow">{label}</Label>
                </FormLabel>
                <Select
                    value={field.value || (noneLabel ? NONE_SENTINEL : "")}
                    onValueChange={(v) => field.onChange(v === NONE_SENTINEL ? "" : v)}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {noneLabel && <SelectItem value={NONE_SENTINEL}>{noneLabel}</SelectItem>}
                        {options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage />
            </FormItem>
        )}
    />
);

type CheckboxFormFieldProps<TFieldValues extends FieldValues> = BaseProps<TFieldValues> & {
    description?: ReactNode;
};

export const CheckboxFormField = <TFieldValues extends FieldValues>({
    control,
    name,
    label,
    className,
    description,
}: CheckboxFormFieldProps<TFieldValues>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className={className ?? "flex flex-row items-start gap-3 space-y-0"}>
                <FormControl>
                    <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(v === true)}
                    />
                </FormControl>
                <div className="grid gap-1">
                    <FormLabel asChild>
                        <Label className="font-medium">{label}</Label>
                    </FormLabel>
                    {description && <FormDescription>{description}</FormDescription>}
                </div>
            </FormItem>
        )}
    />
);
