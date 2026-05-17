import type { JournalEntryResponse, JournalEntryStatus } from "@/lib/api/finance/journal";
import {
    countByStatus as countByStatusGeneric,
    filterByStatusAndQuery,
    parseStatusQuery,
    type StatusQuery,
} from "../../_data/list-query";

export type StatusFilter = JournalEntryStatus | "ALL";
export type JournalQuery = StatusQuery<JournalEntryStatus>;

export const ALL_STATUSES: readonly JournalEntryStatus[] = ["DRAFT", "POSTED", "VOIDED"] as const;

export function parseJournalQuery(searchParams: Record<string, string | string[] | undefined>): JournalQuery {
    return parseStatusQuery(searchParams, ALL_STATUSES);
}

export function filterJournal(entries: JournalEntryResponse[], query: JournalQuery): JournalEntryResponse[] {
    return filterByStatusAndQuery(entries, query, (e) => [e.entryNumber, e.description, e.sourceReference]);
}

export type StatusCounts = Record<StatusFilter, number>;

export function countByStatus(entries: JournalEntryResponse[]): StatusCounts {
    return countByStatusGeneric(entries, ALL_STATUSES);
}

export { PAGE_SIZE, paginate, type PageWindow } from "../../_data/list-query";
