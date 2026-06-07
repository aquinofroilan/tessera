"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    IconCheck,
    IconPencil,
    IconSend,
    IconX,
} from "@tabler/icons-react";

import { Button } from "@/components/ui";
import type { TimeEntryStatus } from "@/lib/api/projects/time-entries";
import {
    approveTimeEntryAction,
    rejectTimeEntryAction,
    submitTimeEntryAction,
} from "../time/[id]/_data/transition-actions";

type Props = { id: string; status: TimeEntryStatus };

type Result = { ok: true } | { ok: false; error: string };

export const TimeEntryRowActions = ({ id, status }: Props) => {
    const [pending, startTransition] = useTransition();

    const run = (fn: (id: string) => Promise<Result>, success: string) => {
        startTransition(async () => {
            const result = await fn(id);
            if (!result.ok) toast.error(result.error);
            else toast.success(success);
        });
    };

    return (
        <div className="inline-flex items-center gap-1.5">
            {status === "DRAFT" && (
                <>
                    <Button asChild variant="ghost" size="sm">
                        <Link href={`/projects/time/${id}/edit`}>
                            <IconPencil stroke={1.8} />
                            Edit
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={pending}
                        onClick={() => run(submitTimeEntryAction, "Entry submitted for approval.")}>
                        <IconSend stroke={1.8} />
                        Submit
                    </Button>
                </>
            )}
            {status === "SUBMITTED" && (
                <>
                    <Button
                        variant="default"
                        size="sm"
                        disabled={pending}
                        onClick={() => run(approveTimeEntryAction, "Entry approved.")}>
                        <IconCheck stroke={1.8} />
                        Approve
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={pending}
                        onClick={() => run(rejectTimeEntryAction, "Entry rejected.")}>
                        <IconX stroke={1.8} />
                        Reject
                    </Button>
                </>
            )}
        </div>
    );
};
