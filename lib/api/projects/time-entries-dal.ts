import "server-only";

import { cache } from "react";

import { apiCreate, apiGetOrNull, apiList } from "@/lib/api/dal";
import { authHeaders, authed } from "@/lib/api/auth-helpers";
import { serverClient } from "@/lib/http";
import type {
    CreateTimeEntryRequest,
    TimeEntryResponse,
    TimeEntryStatus,
    UpdateTimeEntryRequest,
} from "./time-entries";

const TIME_ENTRIES_PATH = "/projects/time-entries";

type ListTimeEntriesQuery = {
    employeeId?: string;
    projectId?: string;
    status?: TimeEntryStatus;
};

export const listTimeEntries = (query?: ListTimeEntriesQuery): Promise<TimeEntryResponse[]> =>
    apiList<TimeEntryResponse>(TIME_ENTRIES_PATH, query);

export const getTimeEntry = cache(
    (id: string): Promise<TimeEntryResponse | null> =>
        apiGetOrNull<TimeEntryResponse>(`${TIME_ENTRIES_PATH}/${id}`),
);

export const createTimeEntry = (body: CreateTimeEntryRequest): Promise<TimeEntryResponse> =>
    apiCreate<TimeEntryResponse>(TIME_ENTRIES_PATH, body);

export const updateTimeEntry = (
    id: string,
    body: UpdateTimeEntryRequest,
): Promise<TimeEntryResponse> =>
    authed(async () =>
        serverClient.patch<TimeEntryResponse>(`${TIME_ENTRIES_PATH}/${id}`, body, {
            headers: await authHeaders(),
        }),
    );

const transition = (suffix: string) => (id: string): Promise<TimeEntryResponse> =>
    authed(async () =>
        serverClient.post<TimeEntryResponse>(`${TIME_ENTRIES_PATH}/${id}/${suffix}`, undefined, {
            headers: await authHeaders(),
        }),
    );

export const submitTimeEntry = transition("submit");
export const approveTimeEntry = transition("approve");
export const rejectTimeEntry = transition("reject");
