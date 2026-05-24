import "server-only";

import { apiCreate, apiList } from "@/lib/api/dal";
import type { CreateStorageLocationRequest, StorageLocationResponse } from "./storage-locations";

const path = (warehouseId: string) => `/inventory/warehouses/${warehouseId}/locations`;

export const listStorageLocations = (warehouseId: string): Promise<StorageLocationResponse[]> =>
    apiList<StorageLocationResponse>(path(warehouseId));

export const createStorageLocation = (
    warehouseId: string,
    body: CreateStorageLocationRequest,
): Promise<StorageLocationResponse> => apiCreate<StorageLocationResponse>(path(warehouseId), body);
