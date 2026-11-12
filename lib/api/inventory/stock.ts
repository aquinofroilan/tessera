export type ItemStockLocation = {
    warehouseId: string;
    warehouseName: string;
    quantity: number;
    unitCost: string;
    value: string;
};

export type ItemStockResponse = {
    itemId: string;
    currencyCode: string | null;
    totalQuantity: number;
    totalValue: string;
    locations: ItemStockLocation[];
};
