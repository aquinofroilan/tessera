import type { AssetStatus, DepreciationMethod } from "./assets";

export type AssetRegisterRow = {
    id: string;
    assetNumber: string;
    name: string;
    categoryCode: string | null;
    categoryName: string | null;
    acquisitionDate: string;
    acquisitionCost: string;
    salvageValue: string;
    accumulatedDepreciation: string;
    netBookValue: string;
    usefulLifeMonths: number;
    depreciationMethod: DepreciationMethod;
    status: AssetStatus;
    location: string | null;
};

export type AssetRegisterResponse = {
    rows: AssetRegisterRow[];
    totalAcquisitionCost: string;
    totalAccumulatedDepreciation: string;
    totalNetBookValue: string;
};

export type DepreciationScheduleRow = {
    assetId: string;
    assetNumber: string;
    periodYear: number;
    periodMonth: number;
    depreciationAmount: string;
    cumulativeDepreciation: string;
    netBookValue: string;
};

export type DepreciationScheduleResponse = {
    rows: DepreciationScheduleRow[];
    months: number;
    assetCount: number;
};
