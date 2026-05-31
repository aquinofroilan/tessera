import "server-only";

import { apiList } from "@/lib/api/dal";
import type { LowStockRow } from "./low-stock";

export const listLowStock = (): Promise<LowStockRow[]> =>
    apiList<LowStockRow>("/inventory/reports/low-stock");
