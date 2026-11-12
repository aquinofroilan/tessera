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
    asOfDate: string;
    warehouses: { id: string; code: string; name: string }[];
    rows: StockOnHandRow[];
};

export type ValuationRow = {
    itemId: string;
    sku: string;
    name: string;
    totalQuantity: number;
    unitOfMeasure: string;
    unitCost: string;
    totalValue: string;
};

export type ValuationReportResponse = {
    asOfDate: string;
    currencyCode: string;
    rows: ValuationRow[];
    totalValue: string;
    glInventoryBalance: string;
    variance: string;
};

export type MovementHistoryRow = {
    movementId: string;
    date: string;
    type: MovementType;
    referenceNumber: string | null;
    itemId: string;
    itemSku: string;
    itemName: string;
    warehouseId: string;
    warehouseName: string;
    quantity: number;
    runningQuantity: number;
    unitCost: string;
    valueChange: string;
};

export type MovementHistoryResponse = {
    startDate: string;
    endDate: string;
    currencyCode: string;
    rows: MovementHistoryRow[];
};
