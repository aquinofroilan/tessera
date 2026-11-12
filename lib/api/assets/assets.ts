export type DepreciationMethod = "STRAIGHT_LINE";

export type AssetStatus = "ACTIVE" | "DISPOSED" | "FULLY_DEPRECIATED";

export type CreateAssetCategoryRequest = {
    code: string;
    name: string;
    description?: string | null;
    defaultUsefulLifeMonths?: number | null;
    defaultDepreciationMethod?: DepreciationMethod;
    defaultSalvageValue?: string;
};

export type UpdateAssetCategoryRequest = {
    name?: string | null;
    description?: string | null;
    defaultUsefulLifeMonths?: number | null;
    defaultDepreciationMethod?: DepreciationMethod | null;
    defaultSalvageValue?: string | null;
    isActive?: boolean | null;
};

export type AssetCategoryResponse = {
    id: string;
    code: string;
    name: string;
    description: string | null;
    defaultUsefulLifeMonths: number | null;
    defaultDepreciationMethod: DepreciationMethod;
    defaultSalvageValue: string;
    isActive: boolean;
    organizationId: string;
    createdAt: string | null;
    updatedAt: string | null;
};

export type CreateFixedAssetRequest = {
    name: string;
    description?: string | null;
    categoryId?: string | null;
    acquisitionDate: string;
    acquisitionCost: string;
    salvageValue?: string;
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
    acquisitionDate: string;
    acquisitionCost: string;
    salvageValue: string;
    usefulLifeMonths: number;
    depreciationMethod: DepreciationMethod;
    location: string | null;
    serialNumber: string | null;
    status: AssetStatus;
    accumulatedDepreciation: string;
    netBookValue: string;
    assetAccountId: string | null;
    accumulatedDepreciationAccountId: string | null;
    depreciationExpenseAccountId: string | null;
    organizationId: string;
    createdAt: string | null;
    updatedAt: string | null;
};
