import "server-only";

import { apiCreate, apiList } from "@/lib/api/dal";
import type { CreateVariantRequest, VariantResponse } from "./variants";

const path = (itemId: string) => `/inventory/items/${itemId}/variants`;

export const listVariants = (itemId: string): Promise<VariantResponse[]> =>
    apiList<VariantResponse>(path(itemId));

export const createVariant = (itemId: string, body: CreateVariantRequest): Promise<VariantResponse> =>
    apiCreate<VariantResponse>(path(itemId), body);
