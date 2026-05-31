import type { IsoDate, IsoDateTime, Money } from "../types";

export type MovementType =
    | "RECEIPT"
    | "ISSUE"
    | "TRANSFER"
    | "ADJUSTMENT_IN"
    | "ADJUSTMENT_OUT";

export const MOVEMENT_TYPES: readonly MovementType[] = [
    "RECEIPT",
    "ISSUE",
    "TRANSFER",
    "ADJUSTMENT_IN",
    "ADJUSTMENT_OUT",
] as const;

export type AdjustmentReason = "COUNT_CORRECTION" | "DAMAGED" | "WRITE_OFF" | "OTHER";

export const ADJUSTMENT_REASONS: readonly AdjustmentReason[] = [
    "COUNT_CORRECTION",
    "DAMAGED",
    "WRITE_OFF",
    "OTHER",
] as const;

export type MovementLineRequest = {
    itemId: string;
    quantity: number;
    unitCost?: Money | null;
    warehouseId: string;
    toWarehouseId?: string | null;
};

export type CreateMovementRequest = {
    type: MovementType;
    date: IsoDate;
    referenceNumber?: string | null;
    sourceBillId?: string | null;
    sourceInvoiceId?: string | null;
    reason?: AdjustmentReason | null;
    memo?: string | null;
    lines: MovementLineRequest[];
};

export type MovementLineResponse = {
    itemId: string;
    itemSku: string;
    itemName: string;
    warehouseId: string;
    warehouseName: string;
    toWarehouseId: string | null;
    toWarehouseName: string | null;
    quantity: number;
    unitCost: Money;
    valueChange: Money;
};

export type MovementResponse = {
    id: string;
    type: MovementType;
    date: IsoDate;
    referenceNumber: string | null;
    sourceBillId: string | null;
    sourceInvoiceId: string | null;
    reason: AdjustmentReason | null;
    memo: string | null;
    lines: MovementLineResponse[];
    totalValue: Money;
    journalEntryId: string | null;
    organizationId: string;
    createdBy: string;
    createdByName: string | null;
    createdAt: IsoDateTime | null;
};

export type MovementSummaryResponse = {
    id: string;
    type: MovementType;
    date: IsoDate;
    referenceNumber: string | null;
    itemCount: number;
    totalValue: Money;
    journalEntryId: string | null;
    createdAt: IsoDateTime | null;
};
