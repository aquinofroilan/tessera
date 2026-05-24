"use client";

import type { MovementType } from "@/lib/api/inventory/movements";
import { StatusToolbar, type StatusToolbarTab } from "../../finance/_components/StatusToolbar";

type ToolbarProps = {
    activeType: MovementType | "ALL";
    counts: Record<MovementType | "ALL", number>;
};

const tabs: StatusToolbarTab<MovementType>[] = [
    { value: "ALL", label: "All" },
    { value: "RECEIPT", label: "Receipts" },
    { value: "ISSUE", label: "Issues" },
    { value: "TRANSFER", label: "Transfers" },
    { value: "ADJUSTMENT_IN", label: "Adj +" },
    { value: "ADJUSTMENT_OUT", label: "Adj −" },
];

export const MovementsToolbar = ({ activeType, counts }: ToolbarProps) => (
    <StatusToolbar
        tabs={tabs}
        activeStatus={activeType}
        initialQ=""
        counts={counts}
        searchPlaceholder="Search reference…"
        searchAriaLabel="Search movements"
        tabsAriaLabel="Filter by movement type"
        paramKey="type"
    />
);
