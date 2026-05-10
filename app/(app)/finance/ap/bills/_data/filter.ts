import type { BillResponse, BillStatus } from "@/lib/api/finance/bills";
import {
    countByStatus as countByStatusGeneric,
    DOCUMENT_STATUSES,
    filterByStatusAndQuery,
    parseStatusQuery,
    type StatusQuery,
} from "../../../_data/list-query";

export type StatusFilter = BillStatus | "ALL";
export type BillsQuery = StatusQuery<BillStatus>;
export const ALL_STATUSES = DOCUMENT_STATUSES as readonly BillStatus[];

export function parseBillsQuery(searchParams: Record<string, string | string[] | undefined>): BillsQuery {
    return parseStatusQuery(searchParams, ALL_STATUSES);
}

export function filterBills(bills: BillResponse[], query: BillsQuery): BillResponse[] {
    return filterByStatusAndQuery(bills, query, (bill) => [bill.billNumber, bill.vendorName, bill.referenceNumber]);
}

export type StatusCounts = Record<StatusFilter, number>;

export function countByStatus(bills: BillResponse[]): StatusCounts {
    return countByStatusGeneric(bills, ALL_STATUSES);
}

export { PAGE_SIZE, paginate, type PageWindow } from "../../../_data/list-query";
