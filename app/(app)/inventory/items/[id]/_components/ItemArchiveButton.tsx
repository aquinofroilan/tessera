"use client";

import { useTransition } from "react";
import { IconArchive, IconArchiveOff } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { setItemStatusAction } from "../_data/toggle-item-status-action";

type ItemArchiveButtonProps = {
    itemId: string;
    isArchived: boolean;
};

export const ItemArchiveButton = ({ itemId, isArchived }: ItemArchiveButtonProps) => {
    const [pending, startTransition] = useTransition();

    const click = () =>
        startTransition(async () => {
            const result = await setItemStatusAction(itemId, isArchived ? "ACTIVE" : "ARCHIVED");
            if (result && !result.ok) toast.error(result.error);
            else toast.success(isArchived ? "Item restored." : "Item archived.");
        });

    return (
        <Button type="button" variant="outline" size="sm" onClick={click} disabled={pending}>
            {isArchived ? <IconArchiveOff stroke={1.8} /> : <IconArchive stroke={1.8} />}
            {isArchived ? "Restore" : "Archive"}
        </Button>
    );
};
