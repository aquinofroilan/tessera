"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconArchive } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { deactivateDepartmentAction } from "../_data/deactivate-department-action";

type Props = {
    departmentId: string;
    isActive: boolean;
};

export const DepartmentDeactivateButton = ({ departmentId, isActive }: Props) => {
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
            const result = await deactivateDepartmentAction(departmentId);
            if (!result.ok) {
                toast.error(result.error);
                return;
            }
            setDone(true);
            toast.success("Department archived.");
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
