"use client";

import { useState, useTransition } from "react";
import { IconLoader2, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { deleteWorkflowRuleAction } from "../_data/delete-rule-action";

export function DeleteRuleButton({ id }: { id: string }) {
    const [confirming, setConfirming] = useState(false);
    const [pending, startTransition] = useTransition();

    const onClick = () => {
        if (!confirming) {
            setConfirming(true);
            return;
        }
        startTransition(async () => {
            const result = await deleteWorkflowRuleAction(id);
            if (result && !result.ok) {
                toast.error(result.error);
                setConfirming(false);
            }
            // On success the server action redirects to /workflow/rules.
        });
    };

    return (
        <Button
            type="button"
            variant={confirming ? "default" : "outline"}
            size="sm"
            onClick={onClick}
            disabled={pending}>
            {pending ? (
                <IconLoader2 className="size-4 animate-[spin_0.9s_linear_infinite]" />
            ) : (
                <IconTrash stroke={1.8} />
            )}
            {confirming ? "Confirm delete" : "Delete"}
        </Button>
    );
}
