"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
    IconCircleCheck,
    IconCircleX,
    IconLock,
    IconPlayerPause,
    IconPlayerPlay,
} from "@tabler/icons-react";

import { Button } from "@/components/ui";
import type { ProjectStatus } from "@/lib/api/projects/projects";
import {
    activateProjectAction,
    cancelProjectAction,
    closeProjectAction,
    holdProjectAction,
} from "../_data/lifecycle-actions";

type Props = { id: string; status: ProjectStatus };

type ActionResult = { ok: true } | { ok: false; error: string };

export const LifecycleActions = ({ id, status }: Props) => {
    const [pending, startTransition] = useTransition();

    const run = (label: string, fn: (id: string) => Promise<ActionResult>, success: string) => {
        startTransition(async () => {
            const result = await fn(id);
            if (!result.ok) toast.error(result.error);
            else toast.success(success);
        });
        void label;
    };

    const canActivate = status === "PLANNED" || status === "ON_HOLD";
    const canHold = status === "ACTIVE";
    const canClose = status === "ACTIVE" || status === "ON_HOLD";
    const canCancel = status !== "CLOSED" && status !== "CANCELLED";

    return (
        <div className="flex flex-wrap items-center gap-2">
            {canActivate && (
                <Button
                    variant="default"
                    size="sm"
                    disabled={pending}
                    onClick={() => run("activate", activateProjectAction, "Project activated.")}>
                    <IconPlayerPlay stroke={1.8} />
                    Activate
                </Button>
            )}
            {canHold && (
                <Button
                    variant="outline"
                    size="sm"
                    disabled={pending}
                    onClick={() => run("hold", holdProjectAction, "Project put on hold.")}>
                    <IconPlayerPause stroke={1.8} />
                    Hold
                </Button>
            )}
            {canClose && (
                <Button
                    variant="outline"
                    size="sm"
                    disabled={pending}
                    onClick={() => run("close", closeProjectAction, "Project closed.")}>
                    <IconLock stroke={1.8} />
                    Close
                </Button>
            )}
            {canCancel && (
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={pending}
                    onClick={() => run("cancel", cancelProjectAction, "Project cancelled.")}>
                    <IconCircleX stroke={1.8} />
                    Cancel
                </Button>
            )}
            {!canActivate && !canHold && !canClose && !canCancel && (
                <span className="inline-flex items-center gap-1.5 text-[12px] text-(--muted)">
                    <IconCircleCheck stroke={1.8} className="size-4" />
                    Terminal state — no further transitions.
                </span>
            )}
        </div>
    );
};
