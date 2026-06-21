"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconLoader2, IconSend } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { postAssetDisposalAction } from "../../_data/disposal-actions";

export function PostDisposalButton({ id }: { id: string }) {
    const router = useRouter();
    const [confirming, setConfirming] = useState(false);
    const [pending, startTransition] = useTransition();

    const onClick = () => {
        if (!confirming) {
            setConfirming(true);
            return;
        }
        startTransition(async () => {
            const result = await postAssetDisposalAction(id);
            if (!result.ok) {
                toast.error(result.error);
                setConfirming(false);
                return;
            }
            toast.success("Disposal posted. Asset retired.");
            router.refresh();
        });
    };

    return (
        <Button type="button" variant={confirming ? "default" : "outline"} onClick={onClick} disabled={pending}>
            {pending ? (
                <IconLoader2 className="size-4 animate-[spin_0.9s_linear_infinite]" />
            ) : (
                <IconSend stroke={1.8} />
            )}
            {confirming ? "Confirm post" : "Post disposal"}
        </Button>
    );
}
