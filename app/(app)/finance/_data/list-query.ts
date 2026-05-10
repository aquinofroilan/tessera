export type DocumentStatus = "DRAFT" | "APPROVED" | "PARTIALLY_PAID" | "PAID" | "VOID";

export const DOCUMENT_STATUSES: readonly DocumentStatus[] = [
    "DRAFT",
    "APPROVED",
    "PARTIALLY_PAID",
    "PAID",
    "VOID",
] as const;

export function isOpenDocument(status: DocumentStatus): boolean {
    return status === "APPROVED" || status === "PARTIALLY_PAID";
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

type WithStatus<S extends string> = { status: S };

export function countByStatus<S extends string>(
    items: WithStatus<S>[],
    statuses: readonly S[],
): Record<S | "ALL", number> {
    const counts = { ALL: items.length } as Record<S | "ALL", number>;
    for (const s of statuses) counts[s] = 0;
    for (const item of items) counts[item.status] += 1;
    return counts;
}

export type StatusQuery<S extends string> = {
    status: S | "ALL";
    q: string;
    page: number;
};

export function parseStatusQuery<S extends string>(
    searchParams: Record<string, string | string[] | undefined>,
    statuses: readonly S[],
): StatusQuery<S> {
    const statusRaw = (Array.isArray(searchParams.status) ? searchParams.status[0] : searchParams.status) ?? "ALL";
    const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q) ?? "";
    const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
    const page = Math.max(1, Number(pageRaw) || 1);
    const status = (statuses.includes(statusRaw as S) || statusRaw === "ALL" ? statusRaw : "ALL") as S | "ALL";
    return { status, q: q.trim(), page };
}

export function filterByStatusAndQuery<S extends string, T extends WithStatus<S>>(
    items: T[],
    query: StatusQuery<S>,
    searchableFields: (item: T) => (string | null | undefined)[],
): T[] {
    const needle = query.q.toLowerCase();
    return items.filter((item) => {
        if (query.status !== "ALL" && item.status !== query.status) return false;
        if (!needle) return true;
        return searchableFields(item).some((f) => f?.toLowerCase().includes(needle));
    });
}
