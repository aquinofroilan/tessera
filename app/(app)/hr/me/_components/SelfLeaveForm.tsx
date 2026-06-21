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
import { submitSelfLeaveAction } from "../_data/submit-self-leave-action";
import {
    SUBMIT_SELF_LEAVE_DEFAULTS,
    submitSelfLeaveSchema,
    type SubmitSelfLeaveValues,
} from "../_data/submit-self-leave-schema";

type LeaveTypeOption = { id: string; name: string };

type Props = {
    leaveTypes: LeaveTypeOption[];
};

export const SelfLeaveForm = ({ leaveTypes }: Props) => {
    const router = useRouter();
    const form = useForm<SubmitSelfLeaveValues>({
        resolver: zodResolver(submitSelfLeaveSchema),
        mode: "onBlur",
        defaultValues: SUBMIT_SELF_LEAVE_DEFAULTS,
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await submitSelfLeaveAction(values);
        if (result && !result.ok) {
            toast.error(result.error);
            return;
        }
        toast.success("Leave request submitted.");
        form.reset(SUBMIT_SELF_LEAVE_DEFAULTS);
        router.refresh();
    });

    if (!leaveTypes.length) {
        return (
            <Card className="px-6 py-8 text-center text-[13px] text-(--muted)">
                No active leave types are configured. Ask your HR lead to create one.
            </Card>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-5">
                <Card className="p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="leaveTypeId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Leave type *</Label>
                                    </FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pick a leave type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {leaveTypes.map((t) => (
                                                <SelectItem key={t.id} value={t.id}>
                                                    {t.name}
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
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Start *</Label>
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
                            name="endDate"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">End *</Label>
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
                            name="reason"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Reason</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Optional. Visible to your HR approver."
                                            maxLength={500}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Submitting…" : "Submit request"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
