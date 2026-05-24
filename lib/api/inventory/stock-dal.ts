import "server-only";

import { cache } from "react";

import { apiGetOrNull } from "@/lib/api/dal";
import type { ItemStockResponse } from "./stock";

export const getItemStock = cache(
    (itemId: string): Promise<ItemStockResponse | null> =>
        apiGetOrNull<ItemStockResponse>(`/inventory/items/${itemId}/stock`),
);
