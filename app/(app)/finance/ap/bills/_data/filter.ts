import type { BillResponse, BillStatus } from "@/lib/api/finance/bills";

export type StatusFilter = BillStatus | "ALL";

export type BillsQuery = {
    status: StatusFilter;
    q: string;
    page: number;
};

export const ALL_STATUSES: BillStatus[] = ["DRAFT", "APPROVED", "PARTIALLY_PAID", "PAID", "VOID"];

export function parseBillsQuery(searchParams: Record<string, string | string[] | undefined>): BillsQuery {
    const status = (Array.isArray(searchParams.status) ? searchParams.status[0] : searchParams.status) ?? "ALL";
    const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q) ?? "";
    const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
    const page = Math.max(1, Number(pageRaw) || 1);
    return {
        status: (ALL_STATUSES.includes(status as BillStatus) || status === "ALL" ? status : "ALL") as StatusFilter,
        q: q.trim(),
        page,
    };
}

export function filterBills(bills: BillResponse[], query: BillsQuery): BillResponse[] {
    const needle = query.q.toLowerCase();
    return bills.filter((bill) => {
        if (query.status !== "ALL" && bill.status !== query.status) return false;
        if (!needle) return true;
        return (
            bill.billNumber.toLowerCase().includes(needle) ||
            bill.vendorName.toLowerCase().includes(needle) ||
            bill.referenceNumber?.toLowerCase().includes(needle)
        );
    });
}

export type StatusCounts = Record<StatusFilter, number>;

export function countByStatus(bills: BillResponse[]): StatusCounts {
    const counts: StatusCounts = { ALL: bills.length, DRAFT: 0, APPROVED: 0, PARTIALLY_PAID: 0, PAID: 0, VOID: 0 };
    for (const bill of bills) counts[bill.status] += 1;
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
