"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    IconCheck,
    IconChevronRight,
    IconCircleX,
    IconSend,
    IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Button, Input } from "@/components/ui";
import type { PurchaseRequestStatus } from "@/lib/api/procurement/purchase-requests";
import {
    approveAction,
    cancelAction,
    rejectAction,
    submitAction,
} from "../_data/lifecycle-actions";

type Props = {
    id: string;
    status: PurchaseRequestStatus;
};

export const LifecycleActions = ({ id, status }: Props) => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [rejecting, setRejecting] = useState(false);
    const [reason, setReason] = useState("");

    const run = (label: string, call: () => Promise<{ ok: true } | { ok: false; error: string }>) => {
        startTransition(async () => {
            const result = await call();
            if (!result.ok) {
                toast.error(result.error);
                return;
            }
            toast.success(label);
            router.refresh();
        });
    };

    if (status === "DRAFT") {
        return (
            <div className="flex flex-wrap gap-2">
                <Button size="sm" disabled={pending} onClick={() => run("Submitted for approval.", () => submitAction(id))}>
                    <IconSend stroke={1.8} />
                    Submit for approval
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={pending}
                    onClick={() => run("Request cancelled.", () => cancelAction(id))}>
                    <IconCircleX stroke={1.8} />
                    Cancel
                </Button>
            </div>
        );
    }

    if (status === "SUBMITTED") {
        return (
            <div className="grid gap-3">
                <div className="flex flex-wrap gap-2">
                    <Button
                        size="sm"
                        disabled={pending}
                        onClick={() => run("Approved.", () => approveAction(id))}>
                        <IconCheck stroke={1.8} />
                        Approve
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pending}
                        onClick={() => setRejecting((v) => !v)}>
                        <IconX stroke={1.8} />
                        Reject
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={pending}
                        onClick={() => run("Request cancelled.", () => cancelAction(id))}>
                        Cancel
                    </Button>
                </div>
                {rejecting && (
                    <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
                        <div className="grid gap-1.5">
                            <label className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                Reason
                            </label>
                            <Input
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Why is this rejected?"
                                maxLength={500}
                                disabled={pending}
                            />
                        </div>
                        <Button
                            size="sm"
                            disabled={pending}
                            onClick={() =>
                                run("Rejected.", () => rejectAction(id, reason).then((r) => {
                                    if (r.ok) {
                                        setRejecting(false);
                                        setReason("");
                                    }
                                    return r;
                                }))
                            }>
                            <IconChevronRight stroke={1.8} />
                            Confirm rejection
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    return null;
};
