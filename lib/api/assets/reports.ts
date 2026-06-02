import type { IsoDate, Money } from "../types";
import type { AssetStatus, DepreciationMethod } from "./assets";

export type AssetRegisterRow = {
    id: string;
    assetNumber: string;
    name: string;
    categoryCode: string | null;
    categoryName: string | null;
    acquisitionDate: IsoDate;
    acquisitionCost: Money;
    salvageValue: Money;
    accumulatedDepreciation: Money;
    netBookValue: Money;
    usefulLifeMonths: number;
    depreciationMethod: DepreciationMethod;
    status: AssetStatus;
    location: string | null;
};

export type AssetRegisterResponse = {
    rows: AssetRegisterRow[];
    totalAcquisitionCost: Money;
    totalAccumulatedDepreciation: Money;
    totalNetBookValue: Money;
};

export type DepreciationScheduleRow = {
    assetId: string;
    assetNumber: string;
    periodYear: number;
    periodMonth: number;
    depreciationAmount: Money;
    cumulativeDepreciation: Money;
    netBookValue: Money;
};

export type DepreciationScheduleResponse = {
    rows: DepreciationScheduleRow[];
    months: number;
    assetCount: number;
};
