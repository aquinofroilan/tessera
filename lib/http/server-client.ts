import "server-only";

import { serverEnv } from "../env";
import { HttpError, HttpTimeoutError } from "./http-error";

type QueryValue = string | number | boolean | null | undefined;

export type RequestOptions = {
    query?: Record<string, QueryValue>;
    headers?: HeadersInit;
    signal?: AbortSignal;
    timeoutMs?: number;
    cache?: RequestCache;
    next?: { revalidate?: number | false; tags?: string[] };
};

const buildUrl = (path: string, query?: RequestOptions["query"]): string => {
    const { BACKEND_API_URL } = serverEnv();
    const base = BACKEND_API_URL.endsWith("/") ? BACKEND_API_URL : `${BACKEND_API_URL}/`;
    const url = new URL(path.replace(/^\//, ""), base);
    if (query) {
        for (const [key, value] of Object.entries(query)) {
            if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
        }
    }
    return url.toString();
};

const parseBody = (text: string): unknown => {
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
};

const request = async <T>(method: string, path: string, body: unknown, options: RequestOptions = {}): Promise<T> => {
    const env = serverEnv();
    const url = buildUrl(path, options.query);
    const timeoutMs = options.timeoutMs ?? env.BACKEND_API_TIMEOUT_MS;

    const headers = new Headers(options.headers);
    headers.set("accept", "application/json");
    if (env.BACKEND_API_TOKEN && !headers.has("authorization")) {
        headers.set("authorization", `Bearer ${env.BACKEND_API_TOKEN}`);
    }

    let payload: string | undefined;
    if (body !== undefined) {
        headers.set("content-type", "application/json");
        payload = JSON.stringify(body);
    }

    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    const signal = options.signal ? AbortSignal.any([options.signal, timeoutSignal]) : timeoutSignal;

    let response: Response;
    let rawBody: string;
    try {
        response = await fetch(url, {
            method,
            headers,
            body: payload,
            signal,
            cache: options.cache,
            next: options.next,
        });
        rawBody = await response.text();
    } catch (error) {
        if (timeoutSignal.aborted) throw new HttpTimeoutError(url, timeoutMs);
        throw error;
    }

    const data = parseBody(rawBody);

    if (!response.ok) {
        throw new HttpError({ status: response.status, statusText: response.statusText, url, body: data });
    }

    return data as T;
};

export const serverClient = {
    get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, undefined, options),
    post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("POST", path, body, options),
    put: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("PUT", path, body, options),
    patch: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>("PATCH", path, body, options),
    del: <T>(path: string, options?: RequestOptions) => request<T>("DELETE", path, undefined, options),
};
