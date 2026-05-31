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
import {
    isAdjustment,
    movementFormDefaults,
    movementFormSchema,
    type MovementFormValues,
} from "../../../_data/movement-form-schema";
import { createMovementAction } from "../_data/create-movement-action";

export type MovementFormItemOption = { id: string; sku: string; name: string };
export type MovementFormWarehouseOption = { id: string; code: string; name: string };

type MovementFormProps = {
    type: MovementFormValues["type"];
    items: MovementFormItemOption[];
    warehouses: MovementFormWarehouseOption[];
    prefill?: Partial<MovementFormValues>;
    source?: { billId?: string; invoiceId?: string };
};

const REASONS: { value: NonNullable<MovementFormValues["reason"]>; label: string }[] = [
    { value: "COUNT_CORRECTION", label: "Count correction" },
    { value: "DAMAGED", label: "Damaged" },
    { value: "WRITE_OFF", label: "Write-off" },
    { value: "OTHER", label: "Other" },
];

export const MovementForm = ({ type, items, warehouses, prefill, source }: MovementFormProps) => {
    const router = useRouter();
    const form = useForm<MovementFormValues>({
        resolver: zodResolver(movementFormSchema),
        mode: "onBlur",
        defaultValues: movementFormDefaults(type, prefill),
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await createMovementAction(values, source);
        if (result && !result.ok) toast.error(result.error);
    });

    const isReceipt = type === "RECEIPT";
    const isTransfer = type === "TRANSFER";
    const isAdj = isAdjustment(type);

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-6">
                <Card className="p-6">
                    <div className="grid gap-5 md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Date *</Label>
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
                            name="referenceNumber"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Reference</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Vendor PO, packing slip, etc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                <Card className="p-6">
                    <Label variant="eyebrow" className="mb-3 text-(--muted)">
                        Line
                    </Label>
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="itemId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Item *</Label>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pick an item" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {items.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.sku} — {item.name}
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
                            name="quantity"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Quantity *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input inputMode="decimal" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormDescription>Always positive — sign is derived from movement type.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="warehouseId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">{isTransfer ? "From warehouse *" : "Warehouse *"}</Label>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pick a warehouse" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {warehouses.map((w) => (
                                                <SelectItem key={w.id} value={w.id}>
                                                    {w.code} — {w.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isTransfer && (
                            <FormField
                                control={form.control}
                                name="toWarehouseId"
                                render={({ field }) => (
                                    <FormItem className="gap-1.5">
                                        <FormLabel asChild>
                                            <Label variant="eyebrow">To warehouse *</Label>
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pick destination" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {warehouses.map((w) => (
                                                    <SelectItem key={w.id} value={w.id}>
                                                        {w.code} — {w.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {isReceipt && (
                            <FormField
                                control={form.control}
                                name="unitCost"
                                render={({ field }) => (
                                    <FormItem className="gap-1.5">
                                        <FormLabel asChild>
                                            <Label variant="eyebrow">Unit cost *</Label>
                                        </FormLabel>
                                        <FormControl>
                                            <Input inputMode="decimal" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormDescription>Drives the cost layer the valuation engine consumes.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                </Card>

                {isAdj && (
                    <Card className="p-6">
                        <Label variant="eyebrow" className="mb-3 text-(--muted)">
                            Adjustment
                        </Label>
                        <div className="grid gap-5 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem className="gap-1.5">
                                        <FormLabel asChild>
                                            <Label variant="eyebrow">Reason *</Label>
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pick a reason" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {REASONS.map((r) => (
                                                    <SelectItem key={r.value} value={r.value}>
                                                        {r.label}
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
                                name="memo"
                                render={({ field }) => (
                                    <FormItem className="gap-1.5">
                                        <FormLabel asChild>
                                            <Label variant="eyebrow">Memo</Label>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Optional context for the auditor" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Card>
                )}

                <div className="flex flex-wrap items-center justify-end gap-2.5">
                    <Button type="button" variant="ghost" size="sm" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="default" size="sm" disabled={form.formState.isSubmitting}>
                        Post movement
                    </Button>
                </div>
            </form>
        </Form>
    );
};
