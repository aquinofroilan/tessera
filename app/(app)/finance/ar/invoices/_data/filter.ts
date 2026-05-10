import type { InvoiceResponse, InvoiceStatus } from "@/lib/api/finance/invoices";

export type StatusFilter = InvoiceStatus | "ALL";

export type InvoicesQuery = {
    status: StatusFilter;
    q: string;
    page: number;
};

export const ALL_STATUSES: InvoiceStatus[] = ["DRAFT", "APPROVED", "PARTIALLY_PAID", "PAID", "VOID"];

export function parseInvoicesQuery(searchParams: Record<string, string | string[] | undefined>): InvoicesQuery {
    const status = (Array.isArray(searchParams.status) ? searchParams.status[0] : searchParams.status) ?? "ALL";
    const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q) ?? "";
    const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
    const page = Math.max(1, Number(pageRaw) || 1);
    return {
        status: (ALL_STATUSES.includes(status as InvoiceStatus) || status === "ALL"
            ? status
            : "ALL") as StatusFilter,
        q: q.trim(),
        page,
    };
}

export function filterInvoices(invoices: InvoiceResponse[], query: InvoicesQuery): InvoiceResponse[] {
    const needle = query.q.toLowerCase();
    return invoices.filter((inv) => {
        if (query.status !== "ALL" && inv.status !== query.status) return false;
        if (!needle) return true;
        return (
            inv.invoiceNumber.toLowerCase().includes(needle) ||
            inv.customerName.toLowerCase().includes(needle) ||
            inv.referenceNumber?.toLowerCase().includes(needle)
        );
    });
}

export type StatusCounts = Record<StatusFilter, number>;

export function countByStatus(invoices: InvoiceResponse[]): StatusCounts {
    const counts: StatusCounts = { ALL: invoices.length, DRAFT: 0, APPROVED: 0, PARTIALLY_PAID: 0, PAID: 0, VOID: 0 };
    for (const inv of invoices) counts[inv.status] += 1;
    return counts;
}

export const PAGE_SIZE = 10;

export type PageWindow = {
    page: number;
    pageCount: number;
    from: number;
    to: number;
    total: number;
};

export function paginate<T>(items: T[], page: number): { rows: T[]; window: PageWindow } {
    const total = items.length;
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, page), pageCount);
    const start = (safePage - 1) * PAGE_SIZE;
    const rows = items.slice(start, start + PAGE_SIZE);
    return {
        rows,
        window: {
            page: safePage,
            pageCount,
            from: total === 0 ? 0 : start + 1,
            to: start + rows.length,
            total,
        },
    };
}
