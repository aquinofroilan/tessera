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
import { recordAttendanceAction } from "../_data/record-attendance-action";
import {
    RECORD_ATTENDANCE_DEFAULTS,
    recordAttendanceSchema,
    type RecordAttendanceValues,
} from "../_data/record-attendance-schema";

type Option = { id: string; name: string };

type Props = {
    employees: Option[];
};

export const NewAttendanceForm = ({ employees }: Props) => {
    const router = useRouter();
    const form = useForm<RecordAttendanceValues>({
        resolver: zodResolver(recordAttendanceSchema),
        mode: "onBlur",
        defaultValues: RECORD_ATTENDANCE_DEFAULTS,
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const result = await recordAttendanceAction(values);
        if (result && !result.ok) toast.error(result.error);
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-6">
                <Card className="p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="employeeId"
                            render={({ field }) => (
                                <FormItem className="gap-1.5 md:col-span-2">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Employee *</Label>
                                    </FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pick an employee" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {employees.map((e) => (
                                                <SelectItem key={e.id} value={e.id}>
                                                    {e.name}
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
                            name="workDate"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Work date *</Label>
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
                            name="status"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Status *</Label>
                                    </FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="PRESENT">Present</SelectItem>
                                            <SelectItem value="ABSENT">Absent</SelectItem>
                                            <SelectItem value="ON_LEAVE">On leave</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="clockIn"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Clock-in</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="clockOut"
                            render={({ field }) => (
                                <FormItem className="gap-1.5">
                                    <FormLabel asChild>
                                        <Label variant="eyebrow">Clock-out</Label>
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
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
                                        <Input placeholder="Optional context for HR" maxLength={500} {...field} />
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
                        {form.formState.isSubmitting ? "Saving…" : "Save record"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
