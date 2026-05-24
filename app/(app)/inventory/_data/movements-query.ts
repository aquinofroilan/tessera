import type { MovementSummaryResponse, MovementType } from "@/lib/api/inventory/movements";

export type MovementsQuery = {
    type: MovementType | "ALL";
    itemId: string | null;
    warehouseId: string | null;
};

export const parseMovementsQuery = (
    searchParams: Record<string, string | string[] | undefined>,
): MovementsQuery => {
    const typeRaw = Array.isArray(searchParams.type) ? searchParams.type[0] : searchParams.type;
    const itemId = Array.isArray(searchParams.itemId) ? searchParams.itemId[0] : searchParams.itemId;
    const warehouseId = Array.isArray(searchParams.warehouseId) ? searchParams.warehouseId[0] : searchParams.warehouseId;
    const type: MovementType | "ALL" =
        typeRaw === "RECEIPT" ||
        typeRaw === "ISSUE" ||
        typeRaw === "TRANSFER" ||
        typeRaw === "ADJUSTMENT_IN" ||
        typeRaw === "ADJUSTMENT_OUT"
            ? typeRaw
            : "ALL";
    return { type, itemId: itemId ?? null, warehouseId: warehouseId ?? null };
};

export const countMovementsByType = (
    rows: MovementSummaryResponse[],
): Record<MovementType | "ALL", number> => {
    const counts: Record<MovementType | "ALL", number> = {
        ALL: rows.length,
        RECEIPT: 0,
        ISSUE: 0,
        TRANSFER: 0,
        ADJUSTMENT_IN: 0,
        ADJUSTMENT_OUT: 0,
    };
    for (const row of rows) counts[row.type] += 1;
    return counts;
};

export const movementTypeLabel = (type: MovementType): string => {
    if (type === "RECEIPT") return "Receipt";
    if (type === "ISSUE") return "Issue";
    if (type === "TRANSFER") return "Transfer";
    if (type === "ADJUSTMENT_IN") return "Adjustment +";
    return "Adjustment −";
};

export const adjustmentReasonLabel = (reason: string): string => {
    if (reason === "COUNT_CORRECTION") return "Count correction";
    if (reason === "DAMAGED") return "Damaged";
    if (reason === "WRITE_OFF") return "Write-off";
    return "Other";
};
