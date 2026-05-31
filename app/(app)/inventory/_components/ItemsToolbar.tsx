"use client";

import type { ItemStatus } from "@/lib/api/inventory/items";
import { StatusToolbar, type StatusToolbarTab } from "../../finance/_components/StatusToolbar";

type ToolbarProps = {
    activeStatus: ItemStatus | "ALL";
    initialQ: string;
    counts: Record<ItemStatus | "ALL", number>;
};

const tabs: StatusToolbarTab<ItemStatus>[] = [
    { value: "ALL", label: "All" },
    { value: "ACTIVE", label: "Active" },
    { value: "ARCHIVED", label: "Archived" },
];

export const ItemsToolbar = ({ activeStatus, initialQ, counts }: ToolbarProps) => (
    <StatusToolbar
        tabs={tabs}
        activeStatus={activeStatus}
        initialQ={initialQ}
        counts={counts}
        searchPlaceholder="Search SKU or name…"
        searchAriaLabel="Search items"
        tabsAriaLabel="Filter items by status"
    />
);
