"use client";

import { type ReactNode } from "react";
import {
    useFieldArray,
    useWatch,
    type ArrayPath,
    type Control,
    type FieldArray,
    type FieldValues,
    type Path,
} from "react-hook-form";
import { IconPlus, IconTrash } from "@tabler/icons-react";

import {
    Button,
    Card,
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
import { formatMoney } from "../_data/format";

export type AccountOption = { id: string; code: string; name: string };

type LineItemsCardProps<T extends FieldValues> = {
    control: Control<T>;
    name: ArrayPath<T>;
    accounts: readonly AccountOption[];
    description: string;
    currencyCode: string;
    accountSelectPlaceholder?: string;
    descriptionPlaceholder?: string;
};

type LineItemValues = {
    accountId: string;
    description?: string;
    amount: string;
};

const emptyLine: LineItemValues = { accountId: "", description: "", amount: "" };

export function LineItemsCard<T extends FieldValues>({
    control,
    name,
    accounts,
    description,
    currencyCode,
    accountSelectPlaceholder = "Account",
    descriptionPlaceholder = "What's this line for?",
}: LineItemsCardProps<T>) {
    const lines = useFieldArray({ control, name });
    const watched = useWatch({ control, name: name as unknown as Path<T> }) as LineItemValues[] | undefined;
    const total = (watched ?? []).reduce((sum, line) => sum + (Number(line?.amount) || 0), 0);

    return (
        <Card className="p-0">
            <div className="flex items-center justify-between border-b border-(--rule-soft) px-6 py-4">
                <div>
                    <div className="font-display text-[16px] font-medium tracking-[-0.005em] text-(--ink)">Lines</div>
                    <div className="text-[12px] text-(--muted)">{description}</div>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => lines.append(emptyLine as FieldArray<T, ArrayPath<T>>)}>

                    <IconPlus stroke={1.8} />
                    Add line
                </Button>
            </div>

            <div className="flex flex-col">
                {
                    lines.fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="grid gap-3 border-b border-(--rule-soft) px-6 py-4 last:border-b-0 md:grid-cols-[minmax(220px,1fr)_minmax(0,1.5fr)_140px_36px]">
                            <FormField
                                control={control}
                                name={`${String(name)}.${index}.accountId` as Path<T>}
                                render={({ field: f }) => (
                                    <FormItem className="gap-1.5">
                                        <FormLabel asChild>
                                            <Label variant="eyebrow">Account *</Label>
                                        </FormLabel>
                                        <Select onValueChange={f.onChange} value={(f.value ?? "") as string}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={accountSelectPlaceholder} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {accounts.map((a) => (
                                                    <SelectItem key={a.id} value={a.id}>
                                                        <span className="flex w-full items-center justify-between gap-3">
                                                            <span>{a.name}</span>
                                                            <span className="font-mono text-[10px] tracking-[0.04em] text-(--muted)">
                                                                {a.code}
                                                            </span>
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name={`${String(name)}.${index}.description` as Path<T>}
                                render={({ field: f }) => (
                                    <FormItem className="gap-1.5">
                                        <FormLabel asChild>
                                            <Label variant="eyebrow">Description</Label>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder={descriptionPlaceholder} {...(f as object)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name={`${String(name)}.${index}.amount` as Path<T>}
                                render={({ field: f }) => (
                                    <FormItem className="gap-1.5">
                                        <FormLabel asChild>
                                            <Label variant="eyebrow">Amount *</Label>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="text-right tabular-nums"
                                                {...(f as object)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-end pb-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label={`Remove line ${index + 1}`}
                                    disabled={lines.fields.length === 1}
                                    onClick={() => lines.remove(index)}>
                                    <IconTrash stroke={1.8} />
                                </Button>
                            </div>
                        </div>
                    )) as ReactNode
                }
            </div>

            <div className="flex items-center justify-end gap-6 border-t border-(--rule) px-6 py-4">
                <span className="font-mono text-[10px] tracking-[0.16em] text-(--muted) uppercase">Total</span>
                <span className="font-display text-[20px] font-[380] tracking-[-0.01em] text-(--ink) tabular-nums">
                    {formatMoney(total.toFixed(2), currencyCode)}
                </span>
            </div>
        </Card>
    );
}
