import type { InvoiceResponse, InvoiceStatus } from "@/lib/api/finance/invoices";
import {
    countByStatus as countByStatusGeneric,
    DOCUMENT_STATUSES,
    filterByStatusAndQuery,
    parseStatusQuery,
    type StatusQuery,
} from "../../../_data/list-query";

export type StatusFilter = InvoiceStatus | "ALL";
export type InvoicesQuery = StatusQuery<InvoiceStatus>;
export const ALL_STATUSES = DOCUMENT_STATUSES as readonly InvoiceStatus[];

export function parseInvoicesQuery(searchParams: Record<string, string | string[] | undefined>): InvoicesQuery {
    return parseStatusQuery(searchParams, ALL_STATUSES);
}

export function filterInvoices(invoices: InvoiceResponse[], query: InvoicesQuery): InvoiceResponse[] {
    return filterByStatusAndQuery(invoices, query, (inv) => [inv.invoiceNumber, inv.customerName, inv.referenceNumber]);
}

export type StatusCounts = Record<StatusFilter, number>;

export function countByStatus(invoices: InvoiceResponse[]): StatusCounts {
    return countByStatusGeneric(invoices, ALL_STATUSES);
}

export { PAGE_SIZE, paginate, type PageWindow } from "../../../_data/list-query";
