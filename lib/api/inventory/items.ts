import type { IsoDateTime, Money } from "../types";

export type ItemStatus = "ACTIVE" | "ARCHIVED";
export type ItemKind = "STOCK" | "SERVICE" | "NON_STOCK";
export type ValuationMethod = "FIFO" | "WEIGHTED_AVERAGE";

export const ITEM_STATUSES: readonly ItemStatus[] = ["ACTIVE", "ARCHIVED"] as const;
export const ITEM_KINDS: readonly ItemKind[] = ["STOCK", "SERVICE", "NON_STOCK"] as const;
export const VALUATION_METHODS: readonly ValuationMethod[] = ["FIFO", "WEIGHTED_AVERAGE"] as const;

export type CreateItemRequest = {
    sku: string;
    name: string;
    description?: string | null;
    kind: ItemKind;
    unitOfMeasure: string;
    valuationMethod: ValuationMethod;
    salesPrice?: Money | null;
    purchaseCost?: Money | null;
    inventoryAccountId?: string | null;
    cogsAccountId?: string | null;
    revenueAccountId?: string | null;
    reorderPoint?: number | null;
    reorderQuantity?: number | null;
    currencyCode?: string | null;
};

export type UpdateItemRequest = Partial<CreateItemRequest> & {
    status?: ItemStatus | null;
};

export type ItemResponse = {
    id: string;
    sku: string;
    name: string;
    description: string | null;
    kind: ItemKind;
    unitOfMeasure: string;
    valuationMethod: ValuationMethod;
    salesPrice: Money | null;
    purchaseCost: Money | null;
    inventoryAccountId: string | null;
    cogsAccountId: string | null;
    revenueAccountId: string | null;
    reorderPoint: number | null;
    reorderQuantity: number | null;
    currencyCode: string | null;
    status: ItemStatus;
    onHand: number;
    onHandValue: Money;
    hasMovements: boolean;
    organizationId: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};

export type ItemSummaryResponse = {
    id: string;
    sku: string;
    name: string;
    kind: ItemKind;
    unitOfMeasure: string;
    status: ItemStatus;
    onHand: number;
    onHandValue: Money;
    reorderPoint: number | null;
    currencyCode: string | null;
};
