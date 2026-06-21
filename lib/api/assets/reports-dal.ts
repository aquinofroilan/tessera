import "server-only";

import { apiGet } from "@/lib/api/dal";
import type { AssetStatus } from "./assets";
import type {
    AssetRegisterResponse,
    DepreciationScheduleResponse,
} from "./reports";

const REPORTS_PATH = "/assets/reports";

type RegisterQuery = {
    status?: AssetStatus;
    categoryId?: string;
};

export const getAssetRegister = (query?: RegisterQuery): Promise<AssetRegisterResponse> =>
    apiGet<AssetRegisterResponse>(`${REPORTS_PATH}/register`, query);

type ScheduleQuery = {
    assetId?: string;
    months?: number;
};

export const getDepreciationSchedule = (query?: ScheduleQuery): Promise<DepreciationScheduleResponse> =>
    apiGet<DepreciationScheduleResponse>(`${REPORTS_PATH}/depreciation-schedule`, query);
