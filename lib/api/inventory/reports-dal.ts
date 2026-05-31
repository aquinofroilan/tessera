import "server-only";

import { apiGet } from "@/lib/api/dal";
import type {
    MovementHistoryResponse,
    StockOnHandResponse,
    ValuationReportResponse,
} from "./reports";
import type { MovementType } from "./movements";

type AsOfQuery = { asOfDate?: string; warehouseId?: string; itemId?: string };

export const getStockOnHand = (params?: AsOfQuery): Promise<StockOnHandResponse> =>
    apiGet<StockOnHandResponse>("/inventory/reports/stock-on-hand", {
        asOfDate: params?.asOfDate,
        warehouseId: params?.warehouseId,
        itemId: params?.itemId,
    });

export const getValuation = (asOfDate?: string): Promise<ValuationReportResponse> =>
    apiGet<ValuationReportResponse>("/inventory/reports/valuation", { asOfDate });

type MovementHistoryQuery = {
    startDate: string;
    endDate: string;
    itemId?: string;
    warehouseId?: string;
    type?: MovementType;
};

export const getMovementHistory = (params: MovementHistoryQuery): Promise<MovementHistoryResponse> =>
    apiGet<MovementHistoryResponse>("/inventory/reports/movements", {
        startDate: params.startDate,
        endDate: params.endDate,
        itemId: params.itemId,
        warehouseId: params.warehouseId,
        type: params.type,
    });
