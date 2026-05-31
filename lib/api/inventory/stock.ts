import type { Money } from "../types";

export type ItemStockLocation = {
    warehouseId: string;
    warehouseName: string;
    quantity: number;
    unitCost: Money;
    value: Money;
};

export type ItemStockResponse = {
    itemId: string;
    currencyCode: string | null;
    totalQuantity: number;
    totalValue: Money;
    locations: ItemStockLocation[];
};
