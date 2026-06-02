"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    Button,
    Card,
    Checkbox,
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
import { KNOWN_NOTIFICATION_KINDS } from "@/lib/api/notification-preferences";
import {
    workflowRuleFormSchema,
    type WorkflowRuleFormValues,
} from "../_data/workflow-rule-schema";

type Props = {
    defaultValues: WorkflowRuleFormValues;
    submitLabel: string;
    action: (values: WorkflowRuleFormValues) => Promise<{ ok: false; error: string } | void>;
};

export function WorkflowRuleForm({ defaultValues, submitLabel, action }: Props) {
    const router = useRouter();
    const form = useForm<WorkflowRuleFormValues>({
        resolver: zodResolver(workflowRuleFormSchema),
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
                            name="name"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Name *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Notify finance on PR approval" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Description</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Optional — why this rule exists"
                                            maxLength={1000}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="eventKind"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">When *</Label>
                                    </FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pick an event" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {KNOWN_NOTIFICATION_KINDS.map((k) => (
                                                <SelectItem key={k.kind} value={k.kind}>
                                                    {k.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>The event that fires the rule.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="actionType"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Notify *</Label>
                                    </FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="NOTIFY_USER">A specific user</SelectItem>
                                            <SelectItem value="NOTIFY_ROLE">Everyone with a role</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="actionTarget"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Target *</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={
                                                form.watch("actionType") === "NOTIFY_ROLE"
                                                    ? "e.g. FINANCE"
                                                    : "User ID"
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {form.watch("actionType") === "NOTIFY_ROLE"
                                            ? "Role name (case-sensitive). Every user in this org with that role assignment is notified."
                                            : "User UUID. Find it under the user's profile."}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="enabled"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <div className="flex items-center gap-2.5">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={(v) => field.onChange(v === true)}
                                            />
                                        </FormControl>
                                        <span className="text-[13px] text-(--ink-soft)">
                                            Enabled — fire this rule when the event happens.
                                        </span>
                                    </div>
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
                        {form.formState.isSubmitting ? "Saving…" : submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
