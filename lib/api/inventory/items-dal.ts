import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    CreateItemRequest,
    ItemKind,
    ItemResponse,
    ItemStatus,
    ItemSummaryResponse,
    UpdateItemRequest,
} from "./items";

const ITEMS_PATH = "/inventory/items";

type ListItemsParams = { status?: ItemStatus; kind?: ItemKind };

export const listItems = (params?: ListItemsParams): Promise<ItemSummaryResponse[]> =>
    apiList<ItemSummaryResponse>(ITEMS_PATH, { status: params?.status, kind: params?.kind });

export const getItem = cache(
    (id: string): Promise<ItemResponse | null> => apiGetOrNull<ItemResponse>(`${ITEMS_PATH}/${id}`),
);

export const createItem = (body: CreateItemRequest): Promise<ItemResponse> =>
    apiCreate<ItemResponse>(ITEMS_PATH, body);

export const updateItem = (id: string, body: UpdateItemRequest): Promise<ItemResponse> =>
    authed(async () =>
        serverClient.patch<ItemResponse>(`${ITEMS_PATH}/${id}`, body, { headers: await authHeaders() }),
    );
