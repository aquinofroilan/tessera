import "server-only";

import { cache } from "react";

import { apiGetOrNull, apiList } from "@/lib/api/dal";
import type { JournalEntryResponse, JournalEntryStatus } from "./journal";

const JOURNAL_PATH = "/finance/journal";

type ListJournalParams = { status?: JournalEntryStatus; startDate?: string; endDate?: string };

export const listJournalEntries = (params?: ListJournalParams): Promise<JournalEntryResponse[]> =>
    apiList<JournalEntryResponse>(JOURNAL_PATH, {
        status: params?.status,
        startDate: params?.startDate,
        endDate: params?.endDate,
    });

export const getJournalEntry = cache(
    (id: string): Promise<JournalEntryResponse | null> =>
        apiGetOrNull<JournalEntryResponse>(`${JOURNAL_PATH}/${id}`),
);
