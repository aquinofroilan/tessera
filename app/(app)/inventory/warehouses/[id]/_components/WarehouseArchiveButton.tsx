"use client";

import { useTransition } from "react";
import { IconArchive, IconArchiveOff } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";
import { setWarehouseActiveAction } from "../_data/toggle-warehouse-status-action";

type WarehouseArchiveButtonProps = {
    warehouseId: string;
    isActive: boolean;
};

export const WarehouseArchiveButton = ({ warehouseId, isActive }: WarehouseArchiveButtonProps) => {
    const [pending, startTransition] = useTransition();

    const click = () =>
        startTransition(async () => {
            const result = await setWarehouseActiveAction(warehouseId, !isActive);
            if (result && !result.ok) toast.error(result.error);
            else toast.success(isActive ? "Warehouse archived." : "Warehouse restored.");
        });

    return (
        <Button type="button" variant="outline" size="sm" onClick={click} disabled={pending}>
            {isActive ? <IconArchive stroke={1.8} /> : <IconArchiveOff stroke={1.8} />}
            {isActive ? "Archive" : "Restore"}
        </Button>
    );
};
