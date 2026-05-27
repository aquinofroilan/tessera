import type { ItemKind } from "@/lib/api/inventory/items";

export const itemKindLabel = (kind: ItemKind): string => {
    if (kind === "STOCK") return "Stock";
    if (kind === "SERVICE") return "Service";
    return "Non-stock";
};

export const formatQuantity = (qty: number, uom: string): string => {
    const rounded = Number.isInteger(qty) ? qty.toString() : qty.toFixed(2);
    return `${rounded} ${uom}`;
};
