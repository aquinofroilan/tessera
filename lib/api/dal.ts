import "server-only";

import { HttpError, serverClient } from "@/lib/http";
import { authed, authHeaders } from "@/lib/api/auth-helpers";

type Query = Record<string, string | number | boolean | null | undefined>;

export const apiList = async <T>(path: string, query?: Query): Promise<T[]> =>
    authed(async () =>
        serverClient.get<T[]>(path, { query, headers: await authHeaders(), cache: "no-store" }),
    );

export const apiGet = async <T>(path: string, query?: Query): Promise<T> =>
    authed(async () =>
        serverClient.get<T>(path, { query, headers: await authHeaders(), cache: "no-store" }),
    );

export const apiGetOrNull = async <T>(path: string): Promise<T | null> => {
    try {
        return await apiGet<T>(path);
    } catch (error) {
        if (error instanceof HttpError && error.status === 404) return null;
        throw error;
    }
};

export const apiCreate = async <T>(path: string, body: unknown): Promise<T> =>
    authed(async () => serverClient.post<T>(path, body, { headers: await authHeaders() }));
