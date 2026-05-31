import "server-only";

import { cache } from "react";

import { apiGetOrNull } from "@/lib/api/dal";
import type { ItemStockResponse } from "./stock";

const path = (itemId: string) => `/inventory/items/${itemId}/stock`;

export const getItemStock = cache(
    (itemId: string): Promise<ItemStockResponse | null> =>
        apiGetOrNull<ItemStockResponse>(path(itemId)),
);
