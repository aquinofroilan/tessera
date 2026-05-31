"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconCash, IconCheck, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button, Card } from "@/components/ui";
import type { PayrollRunStatus } from "@/lib/api/hr/payroll-runs";
import {
    approvePayrollRunAction,
    cancelPayrollRunAction,
    payPayrollRunAction,
} from "../_data/transition-actions";

type Props = { runId: string; status: PayrollRunStatus };

export const PayrollRunActions = ({ runId, status }: Props) => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

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

    if (status === "CANCELLED") {
        return (
            <Card className="p-6 text-[13px] text-(--muted)">
                This run is cancelled. Create a new run to pay this period.
            </Card>
        );
    }

    if (status === "PAID") {
        return (
            <Card className="p-6 text-[13px] text-(--muted)">
                This run is paid. Both the accrual and payment journal entries have been posted.
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex flex-wrap gap-2.5">
                {status === "DRAFT" && (
                    <>
                        <Button
                            variant="default"
                            size="sm"
                            disabled={pending}
                            onClick={() => run(() => approvePayrollRunAction(runId), "Run approved.")}>
                            <IconCheck stroke={1.8} />
                            Approve
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pending}
                            onClick={() => run(() => cancelPayrollRunAction(runId), "Run cancelled.")}>
                            <IconTrash stroke={1.8} />
                            Cancel
                        </Button>
                    </>
                )}
                {status === "APPROVED" && (
                    <Button
                        variant="default"
                        size="sm"
                        disabled={pending}
                        onClick={() => run(() => payPayrollRunAction(runId), "Run marked paid.")}>
                        <IconCash stroke={1.8} />
                        Mark paid
                    </Button>
                )}
            </div>
        </Card>
    );
};
