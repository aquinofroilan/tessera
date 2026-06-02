import "server-only";

import { cache } from "react";

import { apiGet } from "@/lib/api/dal";
import { HttpError } from "@/lib/http";
import type { CallerPermissionsResponse } from "./me";

/**
 * Caller's effective permissions + roles. Cached per request via React's
 * cache() so a layout, nav, and route guard can all call it without
 * round-tripping the backend three times.
 *
 * Returns null when the caller isn't authenticated — that's the signal
 * the guards / nav use to fall back to "no perms".
 */
export const getMyPermissions = cache(
    async (): Promise<CallerPermissionsResponse | null> => {
        try {
            return await apiGet<CallerPermissionsResponse>("/auth/me/permissions");
        } catch (error) {
            if (error instanceof HttpError && error.status === 401) return null;
            throw error;
        }
    },
);
