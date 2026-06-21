"use client";

import { useState, useTransition } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { toast } from "sonner";

import {
    Button,
    Card,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { createDepreciationRunAction } from "../../_data/depreciation-actions";

const MONTHS = [
    { value: "1", label: "Jan" },
    { value: "2", label: "Feb" },
    { value: "3", label: "Mar" },
    { value: "4", label: "Apr" },
    { value: "5", label: "May" },
    { value: "6", label: "Jun" },
    { value: "7", label: "Jul" },
    { value: "8", label: "Aug" },
    { value: "9", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dec" },
];

type Props = {
    defaultYear: number;
    defaultMonth: number;
};

export function NewDepreciationRunForm({ defaultYear, defaultMonth }: Props) {
    const [year, setYear] = useState<string>(String(defaultYear));
    const [month, setMonth] = useState<string>(String(defaultMonth));
    const [pending, startTransition] = useTransition();

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const yearNum = Number.parseInt(year, 10);
        const monthNum = Number.parseInt(month, 10);
        startTransition(async () => {
            const result = await createDepreciationRunAction(yearNum, monthNum);
            if (result && !result.ok) toast.error(result.error);
            // success redirects via the server action
        });
    };

    return (
        <form onSubmit={onSubmit} className="grid gap-6">
            <Card className="grid gap-5 p-6 md:grid-cols-[1fr_1fr_auto] md:items-end">
                <div className="grid gap-1.5">
                    <Label variant="eyebrow">Year</Label>
                    <Input
                        type="number"
                        min={1900}
                        max={2100}
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        disabled={pending}
                    />
                </div>
                <div className="grid gap-1.5">
                    <Label variant="eyebrow">Month</Label>
                    <Select value={month} onValueChange={setMonth} disabled={pending}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {MONTHS.map((m) => (
                                <SelectItem key={m.value} value={m.value}>
                                    {m.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit" disabled={pending}>
                    {pending ? (
                        <>
                            <IconLoader2 className="size-4 animate-[spin_0.9s_linear_infinite]" />
                            Calculating…
                        </>
                    ) : (
                        "Create draft"
                    )}
                </Button>
            </Card>
            <p className="text-[12px] text-(--muted)">
                If a draft already exists for this period it gets refreshed in place. A posted period can&rsquo;t be
                re-run.
            </p>
        </form>
    );
}
