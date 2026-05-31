export type LowStockRow = {
    itemId: string;
    sku: string;
    name: string;
    onHand: number;
    reorderPoint: number;
    reorderQuantity: number | null;
    unitOfMeasure: string;
    primaryVendorId: string | null;
    primaryVendorName: string | null;
};
