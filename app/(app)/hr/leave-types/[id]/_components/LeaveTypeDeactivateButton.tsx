"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconArchive } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { deactivateLeaveTypeAction } from "../_data/deactivate-leave-type-action";

type Props = { id: string; isActive: boolean };

export const LeaveTypeDeactivateButton = ({ id, isActive }: Props) => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [done, setDone] = useState(!isActive);

    if (done || !isActive) {
        return (
            <span className="inline-flex items-center rounded-full bg-(--rule) px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-(--muted) uppercase">
                Archived
            </span>
        );
    }

    const onClick = () => {
        startTransition(async () => {
            const result = await deactivateLeaveTypeAction(id);
            if (!result.ok) {
                toast.error(result.error);
                return;
            }
            setDone(true);
            toast.success("Leave type archived.");
            router.refresh();
        });
    };

    return (
        <Button variant="outline" size="sm" onClick={onClick} disabled={pending}>
            <IconArchive stroke={1.8} />
            Archive
        </Button>
    );
};
