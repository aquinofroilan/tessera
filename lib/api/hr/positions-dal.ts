import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    CreatePositionRequest,
    PositionResponse,
    UpdatePositionRequest,
} from "./positions";

const PATH = "/hr/positions";

export const listPositions = (activeOnly = false): Promise<PositionResponse[]> =>
    apiList<PositionResponse>(PATH, { activeOnly });

export const getPosition = cache(
    (id: string): Promise<PositionResponse | null> => apiGetOrNull<PositionResponse>(`${PATH}/${id}`),
);

export const createPosition = (body: CreatePositionRequest): Promise<PositionResponse> =>
    apiCreate<PositionResponse>(PATH, body);

export const updatePosition = (
    id: string,
    body: UpdatePositionRequest,
): Promise<PositionResponse> =>
    authed(async () =>
        serverClient.patch<PositionResponse>(`${PATH}/${id}`, body, { headers: await authHeaders() }),
    );

export const deactivatePosition = (id: string): Promise<PositionResponse> =>
    authed(async () =>
        serverClient.del<PositionResponse>(`${PATH}/${id}`, { headers: await authHeaders() }),
    );
