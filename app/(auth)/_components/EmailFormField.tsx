"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { IconMail } from "@tabler/icons-react";

import { FormControl, FormField, FormItem, FormLabel, FormMessage, IconInput, Label } from "@/components/ui";

type EmailFormFieldProps<TValues extends FieldValues> = {
    control: Control<TValues>;
    name: FieldPath<TValues>;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
};

export function EmailFormField<TValues extends FieldValues>({
    control,
    name,
    disabled,
    label = "Work email",
    placeholder = "emma@hollisdray.co",
}: EmailFormFieldProps<TValues>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="gap-1.5">
                    <FormLabel asChild>
                        <Label variant="eyebrow">
                            {label} <span className="text-(--accent)">*</span>
                        </Label>
                    </FormLabel>
                    <FormControl>
                        <IconInput
                            type="email"
                            placeholder={placeholder}
                            autoComplete="email"
                            disabled={disabled}
                            startIcon={<IconMail className="h-4 w-4" />}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
