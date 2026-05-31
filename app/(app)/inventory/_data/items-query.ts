import type { ItemKind, ItemStatus, ItemSummaryResponse } from "@/lib/api/inventory/items";

export type ItemsQuery = {
    status: ItemStatus | "ALL";
    kind: ItemKind | "ALL";
    q: string;
};

export const parseItemsQuery = (
    searchParams: Record<string, string | string[] | undefined>,
): ItemsQuery => {
    const statusRaw = Array.isArray(searchParams.status) ? searchParams.status[0] : searchParams.status;
    const kindRaw = Array.isArray(searchParams.kind) ? searchParams.kind[0] : searchParams.kind;
    const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q) ?? "";

    const status: ItemStatus | "ALL" =
        statusRaw === "ACTIVE" || statusRaw === "ARCHIVED" ? statusRaw : "ALL";
    const kind: ItemKind | "ALL" =
        kindRaw === "STOCK" || kindRaw === "SERVICE" || kindRaw === "NON_STOCK" ? kindRaw : "ALL";

    return { status, kind, q: q.trim() };
};

export const filterItems = (items: ItemSummaryResponse[], query: ItemsQuery): ItemSummaryResponse[] => {
    const needle = query.q.toLowerCase();
    return items.filter((item) => {
        if (query.status !== "ALL" && item.status !== query.status) return false;
        if (query.kind !== "ALL" && item.kind !== query.kind) return false;
        if (!needle) return true;
        return item.sku.toLowerCase().includes(needle) || item.name.toLowerCase().includes(needle);
    });
};

export const countItemsByStatus = (
    items: ItemSummaryResponse[],
): Record<ItemStatus | "ALL", number> => {
    let active = 0;
    let archived = 0;
    for (const item of items) {
        if (item.status === "ACTIVE") active += 1;
        else if (item.status === "ARCHIVED") archived += 1;
    }
    return { ALL: items.length, ACTIVE: active, ARCHIVED: archived };
};
