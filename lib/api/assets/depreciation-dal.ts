import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    CreateDepreciationRunRequest,
    DepreciationRunResponse,
} from "./depreciation";

const PATH = "/assets/depreciation-runs";

export const listDepreciationRuns = (): Promise<DepreciationRunResponse[]> =>
    apiList<DepreciationRunResponse>(PATH);

export const getDepreciationRun = cache(
    (id: string): Promise<DepreciationRunResponse | null> =>
        apiGetOrNull<DepreciationRunResponse>(`${PATH}/${id}`),
);

export const createDepreciationRun = (body: CreateDepreciationRunRequest): Promise<DepreciationRunResponse> =>
    apiCreate<DepreciationRunResponse>(PATH, body);

export const postDepreciationRun = (id: string): Promise<DepreciationRunResponse> =>
    authed(async () =>
        serverClient.post<DepreciationRunResponse>(`${PATH}/${id}/post`, undefined, {
            headers: await authHeaders(),
        }),
    );
