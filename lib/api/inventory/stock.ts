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
    currencyCode: string;
    totalQuantity: number;
    totalValue: Money;
    locations: ItemStockLocation[];
};
