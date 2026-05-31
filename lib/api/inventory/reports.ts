import type { IsoDate, Money } from "../types";
import type { MovementType } from "./movements";

export type StockOnHandRow = {
    itemId: string;
    sku: string;
    name: string;
    unitOfMeasure: string;
    quantitiesByWarehouse: Record<string, number>;
    totalQuantity: number;
};

export type StockOnHandResponse = {
    asOfDate: IsoDate;
    warehouses: { id: string; code: string; name: string }[];
    rows: StockOnHandRow[];
};

export type ValuationRow = {
    itemId: string;
    sku: string;
    name: string;
    totalQuantity: number;
    unitOfMeasure: string;
    unitCost: Money;
    totalValue: Money;
};

export type ValuationReportResponse = {
    asOfDate: IsoDate;
    currencyCode: string;
    rows: ValuationRow[];
    totalValue: Money;
    glInventoryBalance: Money;
    variance: Money;
};

export type MovementHistoryRow = {
    movementId: string;
    date: IsoDate;
    type: MovementType;
    referenceNumber: string | null;
    itemId: string;
    itemSku: string;
    itemName: string;
    warehouseId: string;
    warehouseName: string;
    quantity: number;
    runningQuantity: number;
    unitCost: Money;
    valueChange: Money;
};

export type MovementHistoryResponse = {
    startDate: IsoDate;
    endDate: IsoDate;
    currencyCode: string;
    rows: MovementHistoryRow[];
};
