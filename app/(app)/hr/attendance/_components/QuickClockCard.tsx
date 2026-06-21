"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconLogin2, IconLogout2 } from "@tabler/icons-react";
import { toast } from "sonner";

import {
    Button,
    Card,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { clockInAction, clockOutAction } from "../_data/clock-actions";

type Option = { id: string; name: string };

type Props = {
    employees: Option[];
};

export const QuickClockCard = ({ employees }: Props) => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [employeeId, setEmployeeId] = useState<string>(employees[0]?.id ?? "");

    const run = (direction: "in" | "out") => {
        if (!employeeId) {
            toast.error("Pick an employee first.");
            return;
        }
        startTransition(async () => {
            const result =
                direction === "in" ? await clockInAction(employeeId) : await clockOutAction(employeeId);
            if (!result.ok) {
                toast.error(result.error);
                return;
            }
            const verb = direction === "in" ? "Clocked in" : "Clocked out";
            const name = employees.find((e) => e.id === employeeId)?.name ?? "employee";
            toast.success(`${verb}: ${name}.`);
            router.refresh();
        });
    };

    if (!employees.length) {
        return (
            <Card className="px-6 py-8 text-center text-[13px] text-(--muted)">
                Add an active employee before clocking anyone in.
            </Card>
        );
    }

    return (
        <Card className="grid gap-4 p-6 md:grid-cols-[1fr_auto_auto] md:items-end">
            <div className="grid gap-1.5">
                <label className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                    Employee
                </label>
                <Select value={employeeId} onValueChange={setEmployeeId} disabled={pending}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pick an employee" />
                    </SelectTrigger>
                    <SelectContent>
                        {employees.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                                {e.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button type="button" onClick={() => run("in")} disabled={pending}>
                <IconLogin2 stroke={1.8} />
                Clock in
            </Button>
            <Button type="button" variant="outline" onClick={() => run("out")} disabled={pending}>
                <IconLogout2 stroke={1.8} />
                Clock out
            </Button>
        </Card>
    );
};
