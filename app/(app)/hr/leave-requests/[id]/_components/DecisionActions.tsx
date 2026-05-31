"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconX, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button, Card, Input, Label } from "@/components/ui";
import type { LeaveRequestStatus } from "@/lib/api/hr/leave-requests";
import {
    approveLeaveRequestAction,
    cancelLeaveRequestAction,
    rejectLeaveRequestAction,
} from "../_data/decision-actions";

type Props = { requestId: string; status: LeaveRequestStatus };

export const DecisionActions = ({ requestId, status }: Props) => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [rejectReason, setRejectReason] = useState("");

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

    if (status !== "PENDING") {
        return (
            <Card className="p-6 text-[13px] text-(--muted)">
                This request is {status.toLowerCase()}. No further decisions are possible — file a new request
                if circumstances change.
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            <Card className="p-6">
                <Label variant="eyebrow" className="mb-3 text-(--muted)">
                    Decide
                </Label>
                <div className="flex flex-wrap items-end gap-3">
                    <div className="min-w-72 flex-1">
                        <Label variant="eyebrow" className="mb-1.5 block text-(--muted)">
                            Rejection note (optional)
                        </Label>
                        <Input
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Will be visible on the request audit trail"
                        />
                    </div>
                    <Button
                        variant="default"
                        size="sm"
                        disabled={pending}
                        onClick={() =>
                            run(() => approveLeaveRequestAction(requestId), "Request approved.")
                        }>
                        <IconCheck stroke={1.8} />
                        Approve
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pending}
                        onClick={() =>
                            run(
                                () => rejectLeaveRequestAction(requestId, rejectReason),
                                "Request rejected.",
                            )
                        }>
                        <IconX stroke={1.8} />
                        Reject
                    </Button>
                </div>
            </Card>

            <Card className="p-6">
                <Label variant="eyebrow" className="mb-3 text-(--muted)">
                    Withdraw
                </Label>
                <div className="flex flex-wrap items-center gap-3">
                    <p className="text-[13px] text-(--muted) flex-1">
                        Cancel the request before anyone decides. The balance is released immediately.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pending}
                        onClick={() =>
                            run(() => cancelLeaveRequestAction(requestId), "Request cancelled.")
                        }>
                        <IconTrash stroke={1.8} />
                        Cancel request
                    </Button>
                </div>
            </Card>
        </div>
    );
};
