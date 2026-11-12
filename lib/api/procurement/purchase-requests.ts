export type PurchaseRequestStatus =
    | "DRAFT"
    | "SUBMITTED"
    | "APPROVED"
    | "REJECTED"
    | "CONVERTED"
    | "CANCELLED";

export type CreatePurchaseRequestLine = {
    productId: string;
    quantity: string;
    estimatedUnitCost?: string | null;
    description?: string | null;
};

export type CreatePurchaseRequestRequest = {
    suggestedVendorId?: string | null;
    warehouseId?: string | null;
    justification?: string | null;
    lines: CreatePurchaseRequestLine[];
};

export type RejectPurchaseRequestRequest = {
    reason?: string | null;
};

export type ConvertPurchaseRequestLineCost = {
    lineId: string;
    unitCost: string;
};

export type ConvertPurchaseRequestRequest = {
    vendorId?: string | null;
    warehouseId?: string | null;
    orderDate?: string | null;
    expectedDate?: string | null;
    lineCosts?: ConvertPurchaseRequestLineCost[] | null;
};

export type PurchaseRequestLineResponse = {
    id: string;
    lineNumber: number;
    productId: string;
    productSku: string;
    productName: string;
    quantity: string;
    estimatedUnitCost: string | null;
    description: string | null;
};

export type PurchaseRequestResponse = {
    id: string;
    prNumber: string;
    organizationId: string;
    status: PurchaseRequestStatus;
    suggestedVendorId: string | null;
    warehouseId: string | null;
    justification: string | null;
    lines: PurchaseRequestLineResponse[];
    requestedBy: string;
    decidedBy: string | null;
    decidedAt: string | null;
    decisionReason: string | null;
    convertedPurchaseOrderId: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};
