import "server-only";

import { cache } from "react";

import { HttpError, serverClient } from "@/lib/http";
import { authed, authHeaders } from "@/lib/api/auth-helpers";
import type { JournalEntryResponse, JournalEntryStatus } from "./journal";

const JOURNAL_PATH = "/finance/journal";

type ListJournalParams = { status?: JournalEntryStatus; startDate?: string; endDate?: string };

export const listJournalEntries = async (params?: ListJournalParams): Promise<JournalEntryResponse[]> =>
    authed(async () =>
        serverClient.get<JournalEntryResponse[]>(JOURNAL_PATH, {
            query: { status: params?.status, startDate: params?.startDate, endDate: params?.endDate },
            headers: await authHeaders(),
            cache: "no-store",
        }),
    );

export const getJournalEntry = cache(async (id: string): Promise<JournalEntryResponse | null> =>
    authed(async () => {
        try {
            return await serverClient.get<JournalEntryResponse>(`${JOURNAL_PATH}/${id}`, {
                headers: await authHeaders(),
                cache: "no-store",
            });
        } catch (error) {
            if (error instanceof HttpError && error.status === 404) return null;
            throw error;
        }
    }),
);
