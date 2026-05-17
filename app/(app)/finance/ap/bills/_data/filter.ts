import type { BillStatus, BillSummaryResponse } from "@/lib/api/finance/bills";
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

export const parseBillsQuery = (searchParams: Record<string, string | string[] | undefined>): BillsQuery =>
    parseStatusQuery(searchParams, ALL_STATUSES);

export const filterBills = (bills: BillSummaryResponse[], query: BillsQuery): BillSummaryResponse[] =>
    filterByStatusAndQuery(bills, query, (bill) => [bill.billNumber, bill.vendorName]);

export type StatusCounts = Record<StatusFilter, number>;

export const countByStatus = (bills: BillSummaryResponse[]): StatusCounts =>
    countByStatusGeneric(bills, ALL_STATUSES);

export { PAGE_SIZE, paginate, type PageWindow } from "../../../_data/list-query";
