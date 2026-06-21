import type { Money, IsoDate, IsoDateTime } from "../types";

export type DepreciationMethod = "STRAIGHT_LINE";

export type AssetStatus = "ACTIVE" | "DISPOSED" | "FULLY_DEPRECIATED";

export type CreateAssetCategoryRequest = {
    code: string;
    name: string;
    description?: string | null;
    defaultUsefulLifeMonths?: number | null;
    defaultDepreciationMethod?: DepreciationMethod;
    defaultSalvageValue?: Money;
};

export type UpdateAssetCategoryRequest = {
    name?: string | null;
    description?: string | null;
    defaultUsefulLifeMonths?: number | null;
    defaultDepreciationMethod?: DepreciationMethod | null;
    defaultSalvageValue?: Money | null;
    isActive?: boolean | null;
};

export type AssetCategoryResponse = {
    id: string;
    code: string;
    name: string;
    description: string | null;
    defaultUsefulLifeMonths: number | null;
    defaultDepreciationMethod: DepreciationMethod;
    defaultSalvageValue: Money;
    isActive: boolean;
    organizationId: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};

export type CreateFixedAssetRequest = {
    name: string;
    description?: string | null;
    categoryId?: string | null;
    acquisitionDate: IsoDate;
    acquisitionCost: Money;
    salvageValue?: Money;
    usefulLifeMonths: number;
    depreciationMethod?: DepreciationMethod;
    location?: string | null;
    serialNumber?: string | null;
    assetAccountId?: string | null;
    accumulatedDepreciationAccountId?: string | null;
    depreciationExpenseAccountId?: string | null;
};

export type UpdateFixedAssetRequest = {
    name?: string | null;
    description?: string | null;
    categoryId?: string | null;
    location?: string | null;
    serialNumber?: string | null;
    assetAccountId?: string | null;
    accumulatedDepreciationAccountId?: string | null;
    depreciationExpenseAccountId?: string | null;
};

export type FixedAssetResponse = {
    id: string;
    assetNumber: string;
    name: string;
    description: string | null;
    categoryId: string | null;
    acquisitionDate: IsoDate;
    acquisitionCost: Money;
    salvageValue: Money;
    usefulLifeMonths: number;
    depreciationMethod: DepreciationMethod;
    location: string | null;
    serialNumber: string | null;
    status: AssetStatus;
    accumulatedDepreciation: Money;
    netBookValue: Money;
    assetAccountId: string | null;
    accumulatedDepreciationAccountId: string | null;
    depreciationExpenseAccountId: string | null;
    organizationId: string;
    createdAt: IsoDateTime | null;
    updatedAt: IsoDateTime | null;
};
