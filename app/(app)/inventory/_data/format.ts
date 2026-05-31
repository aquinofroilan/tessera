import type { ItemKind } from "@/lib/api/inventory/items";

export const itemKindLabel = (kind: ItemKind): string => {
    if (kind === "STOCK") return "Stock";
    if (kind === "SERVICE") return "Service";
    return "Non-stock";
};

export const formatQuantityNumber = (qty: number): string =>
    Number.isInteger(qty) ? qty.toString() : qty.toFixed(2);

export const formatQuantity = (qty: number, uom: string): string => `${formatQuantityNumber(qty)} ${uom}`;
