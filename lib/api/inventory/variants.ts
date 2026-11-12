export type CreateVariantRequest = {
    skuSuffix: string;
    attributes: Record<string, string>;
    salesPrice?: string | null;
    purchaseCost?: string | null;
};

export type VariantResponse = {
    id: string;
    itemId: string;
    sku: string;
    skuSuffix: string;
    attributes: Record<string, string>;
    salesPrice: string | null;
    purchaseCost: string | null;
    onHand: number;
    isActive: boolean;
    organizationId: string;
    createdAt: string | null;
    updatedAt: string | null;
};
