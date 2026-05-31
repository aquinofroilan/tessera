import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type { CreateWarehouseRequest, UpdateWarehouseRequest, WarehouseResponse } from "./warehouses";

const WAREHOUSES_PATH = "/inventory/warehouses";

export const listWarehouses = (): Promise<WarehouseResponse[]> => apiList<WarehouseResponse>(WAREHOUSES_PATH);

export const getWarehouse = cache(
    (id: string): Promise<WarehouseResponse | null> =>
        apiGetOrNull<WarehouseResponse>(`${WAREHOUSES_PATH}/${id}`),
);

export const createWarehouse = (body: CreateWarehouseRequest): Promise<WarehouseResponse> =>
    apiCreate<WarehouseResponse>(WAREHOUSES_PATH, body);

export const updateWarehouse = (id: string, body: UpdateWarehouseRequest): Promise<WarehouseResponse> =>
    authed(async () =>
        serverClient.patch<WarehouseResponse>(`${WAREHOUSES_PATH}/${id}`, body, {
            headers: await authHeaders(),
        }),
    );
