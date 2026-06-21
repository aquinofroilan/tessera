import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    AssetDisposalResponse,
    CreateAssetDisposalRequest,
} from "./disposals";

const PATH = "/assets/disposals";

export const listAssetDisposals = (): Promise<AssetDisposalResponse[]> =>
    apiList<AssetDisposalResponse>(PATH);

export const getAssetDisposal = cache(
    (id: string): Promise<AssetDisposalResponse | null> =>
        apiGetOrNull<AssetDisposalResponse>(`${PATH}/${id}`),
);

export const createAssetDisposal = (
    body: CreateAssetDisposalRequest,
): Promise<AssetDisposalResponse> => apiCreate<AssetDisposalResponse>(PATH, body);

export const postAssetDisposal = (id: string): Promise<AssetDisposalResponse> =>
    authed(async () =>
        serverClient.post<AssetDisposalResponse>(`${PATH}/${id}/post`, undefined, {
            headers: await authHeaders(),
        }),
    );
