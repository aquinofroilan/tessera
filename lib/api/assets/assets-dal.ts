import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    AssetCategoryResponse,
    AssetStatus,
    CreateAssetCategoryRequest,
    CreateFixedAssetRequest,
    FixedAssetResponse,
    UpdateAssetCategoryRequest,
    UpdateFixedAssetRequest,
} from "./assets";

const ASSETS_PATH = "/assets";
const CATEGORIES_PATH = "/assets/categories";

type ListAssetsQuery = {
    status?: AssetStatus;
    categoryId?: string;
};

export const listAssets = (query?: ListAssetsQuery): Promise<FixedAssetResponse[]> =>
    apiList<FixedAssetResponse>(ASSETS_PATH, query);

export const getAsset = cache(
    (id: string): Promise<FixedAssetResponse | null> =>
        apiGetOrNull<FixedAssetResponse>(`${ASSETS_PATH}/${id}`),
);

export const createAsset = (body: CreateFixedAssetRequest): Promise<FixedAssetResponse> =>
    apiCreate<FixedAssetResponse>(ASSETS_PATH, body);

export const updateAsset = (
    id: string,
    body: UpdateFixedAssetRequest,
): Promise<FixedAssetResponse> =>
    authed(async () =>
        serverClient.patch<FixedAssetResponse>(`${ASSETS_PATH}/${id}`, body, {
            headers: await authHeaders(),
        }),
    );

export const listAssetCategories = (activeOnly = false): Promise<AssetCategoryResponse[]> =>
    apiList<AssetCategoryResponse>(CATEGORIES_PATH, { activeOnly });

export const getAssetCategory = cache(
    (id: string): Promise<AssetCategoryResponse | null> =>
        apiGetOrNull<AssetCategoryResponse>(`${CATEGORIES_PATH}/${id}`),
);

export const createAssetCategory = (body: CreateAssetCategoryRequest): Promise<AssetCategoryResponse> =>
    apiCreate<AssetCategoryResponse>(CATEGORIES_PATH, body);

export const updateAssetCategory = (
    id: string,
    body: UpdateAssetCategoryRequest,
): Promise<AssetCategoryResponse> =>
    authed(async () =>
        serverClient.patch<AssetCategoryResponse>(`${CATEGORIES_PATH}/${id}`, body, {
            headers: await authHeaders(),
        }),
    );
