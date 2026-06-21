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
    DISPOSAL_FORM_DEFAULTS,
    disposalFormSchema,
    type DisposalFormValues,
} from "../_data/disposal-form-schema";
import { createAssetDisposalAction } from "../_data/disposal-actions";

type Option = { id: string; label: string };

type Props = {
    assets: Option[];
    accounts: Option[];
};

const NONE = "__none__";

export function DisposalForm({ assets, accounts }: Props) {
    const router = useRouter();
    const form = useForm<DisposalFormValues>({
        resolver: zodResolver(disposalFormSchema),
        mode: "onBlur",
        defaultValues: DISPOSAL_FORM_DEFAULTS,
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await createAssetDisposalAction(values);
        if (result && !result.ok) toast.error(result.error);
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-6">
                <Card className="p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="assetId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Asset *</Label>
                                    </FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pick the asset to dispose" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {assets.map((a) => (
                                                <SelectItem key={a.id} value={a.id}>
                                                    {a.label}
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
                            name="disposalType"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Type *</Label>
                                    </FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="SALE">Sale — receive cash</SelectItem>
                                            <SelectItem value="WRITE_OFF">Write-off — no proceeds</SelectItem>
                                            <SelectItem value="SCRAP">Scrap — minimal proceeds</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="disposalDate"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Disposal date *</Label>
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
                            name="proceeds"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Proceeds</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input inputMode="decimal" placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Notes</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Optional context" maxLength={1000} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                <Card className="grid gap-5 p-6">
                    <div className="grid gap-1">
                        <div className="font-display text-foreground text-lg font-[380]">GL routing</div>
                        <div className="text-[12px] text-(--muted)">
                            Required at post time. Gain/loss is always required; cash is required when proceeds &gt; 0.
                        </div>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="gainLossAccountId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Gain / loss</Label>
                                    </FormLabel>
                                    <Select
                                        value={field.value || NONE}
                                        onValueChange={(v) => field.onChange(v === NONE ? "" : v)}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="—" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Not configured</SelectItem>
                                            {accounts.map((a) => (
                                                <SelectItem key={a.id} value={a.id}>
                                                    {a.label}
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
                            name="cashAccountId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Cash</Label>
                                    </FormLabel>
                                    <Select
                                        value={field.value || NONE}
                                        onValueChange={(v) => field.onChange(v === NONE ? "" : v)}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="—" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={NONE}>Not configured</SelectItem>
                                            {accounts.map((a) => (
                                                <SelectItem key={a.id} value={a.id}>
                                                    {a.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                        {form.formState.isSubmitting ? "Saving…" : "Create draft"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
