import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import type {
    CreateMovementRequest,
    MovementResponse,
    MovementSummaryResponse,
    MovementType,
} from "./movements";

const MOVEMENTS_PATH = "/inventory/movements";

type ListMovementsParams = {
    type?: MovementType;
    itemId?: string;
    warehouseId?: string;
    startDate?: string;
    endDate?: string;
};

export const listMovements = (params?: ListMovementsParams): Promise<MovementSummaryResponse[]> =>
    apiList<MovementSummaryResponse>(MOVEMENTS_PATH, {
        type: params?.type,
        itemId: params?.itemId,
        warehouseId: params?.warehouseId,
        startDate: params?.startDate,
        endDate: params?.endDate,
    });

export const getMovement = cache(
    (id: string): Promise<MovementResponse | null> =>
        apiGetOrNull<MovementResponse>(`${MOVEMENTS_PATH}/${id}`),
);

export const createMovement = (body: CreateMovementRequest): Promise<MovementResponse> =>
    apiCreate<MovementResponse>(MOVEMENTS_PATH, body);
