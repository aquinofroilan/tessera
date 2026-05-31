import type { IsoDateTime, Money } from "../types";

export type CreateVariantRequest = {
    skuSuffix: string;
    attributes: Record<string, string>;
    salesPrice?: Money | null;
    purchaseCost?: Money | null;
};

export type VariantResponse = {
    id: string;
    itemId: string;
    sku: string;
    skuSuffix: string;
    attributes: Record<string, string>;
    salesPrice: Money | null;
    purchaseCost: Money | null;
    onHand: number;
    isActive: boolean;
    organizationId: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
