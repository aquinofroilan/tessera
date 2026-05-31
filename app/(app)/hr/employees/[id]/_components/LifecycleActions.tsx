"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    IconArrowBackUp,
    IconBeach,
    IconBriefcase,
    IconLogout2,
} from "@tabler/icons-react";
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
import type { DepartmentOption } from "../../_components/EmployeeForm";
import type { EmploymentStatus } from "@/lib/api/hr/employees";
import { NONE_SENTINEL } from "../../../_data/select-sentinels";
import {
    assignDepartmentAction,
    placeOnLeaveAction,
    returnFromLeaveAction,
    terminateEmployeeAction,
} from "../_data/lifecycle-actions";

type Props = {
    employeeId: string;
    status: EmploymentStatus;
    currentDepartmentId: string | null;
    departments: DepartmentOption[];
};

const todayIso = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const LifecycleActions = ({ employeeId, status, currentDepartmentId, departments }: Props) => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [deptValue, setDeptValue] = useState(currentDepartmentId ?? "");
    const [termDate, setTermDate] = useState(todayIso());
    const terminated = status === "TERMINATED";

    const run = (fn: () => Promise<{ ok: boolean; error?: string }>, successMsg: string) => {
        startTransition(async () => {
            const result = await fn();
            if (!result.ok) {
                toast.error(result.error ?? "Something went wrong.");
                return;
            }
            toast.success(successMsg);
            router.refresh();
        });
    };

    return (
        <div className="grid gap-4">
            <Card className="p-6">
                <Label variant="eyebrow" className="mb-3 text-(--muted)">
                    Department
                </Label>
                <div className="flex flex-wrap items-end gap-3">
                    <div className="min-w-72 flex-1">
                        <Select
                            value={deptValue || NONE_SENTINEL}
                            onValueChange={(v) => setDeptValue(v === NONE_SENTINEL ? "" : v)}
                            disabled={terminated || pending}>
                            <SelectTrigger>
                                <SelectValue placeholder="Unassigned" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={NONE_SENTINEL}>(unassigned)</SelectItem>
                                {departments.map((d) => (
                                    <SelectItem key={d.id} value={d.id}>
                                        {d.code} · {d.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={terminated || pending || deptValue === (currentDepartmentId ?? "")}
                        onClick={() =>
                            run(
                                () => assignDepartmentAction(employeeId, deptValue || null),
                                "Department updated.",
                            )
                        }>
                        <IconBriefcase stroke={1.8} />
                        Reassign
                    </Button>
                </div>
            </Card>

            <Card className="p-6">
                <Label variant="eyebrow" className="mb-3 text-(--muted)">
                    Status
                </Label>
                <div className="flex flex-wrap gap-2.5">
                    {status === "ACTIVE" && (
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pending}
                            onClick={() => run(() => placeOnLeaveAction(employeeId), "Placed on leave.")}>
                            <IconBeach stroke={1.8} />
                            Place on leave
                        </Button>
                    )}
                    {status === "ON_LEAVE" && (
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pending}
                            onClick={() => run(() => returnFromLeaveAction(employeeId), "Returned to active.")}>
                            <IconArrowBackUp stroke={1.8} />
                            Return from leave
                        </Button>
                    )}
                </div>
            </Card>

            {!terminated && (
                <Card className="p-6">
                    <Label variant="eyebrow" className="mb-3 text-(--muted)">
                        Termination
                    </Label>
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="grid gap-1.5">
                            <Label variant="eyebrow" className="text-(--muted)">
                                Termination date
                            </Label>
                            <Input
                                type="date"
                                value={termDate}
                                onChange={(e) => setTermDate(e.target.value)}
                                className="w-44"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pending}
                            onClick={() =>
                                run(
                                    () => terminateEmployeeAction(employeeId, termDate),
                                    "Employee terminated.",
                                )
                            }>
                            <IconLogout2 stroke={1.8} />
                            Terminate
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};
