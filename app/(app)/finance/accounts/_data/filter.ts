import type { AccountResponse, AccountType } from "@/lib/api/finance/accounts";
import { paginate, type PageWindow } from "../../_data/list-query";

export type TypeFilter = AccountType | "ALL";

export type AccountsQuery = {
    type: TypeFilter;
    q: string;
    page: number;
};

export const ALL_TYPES: readonly AccountType[] = ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"] as const;

export function parseAccountsQuery(searchParams: Record<string, string | string[] | undefined>): AccountsQuery {
    const typeRaw = (Array.isArray(searchParams.type) ? searchParams.type[0] : searchParams.type) ?? "ALL";
    const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q) ?? "";
    const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
    const page = Math.max(1, Number(pageRaw) || 1);
    const type: TypeFilter =
        ALL_TYPES.includes(typeRaw as AccountType) || typeRaw === "ALL" ? (typeRaw as TypeFilter) : "ALL";
    return { type, q: q.trim(), page };
}

export function filterAccounts(accounts: AccountResponse[], query: AccountsQuery): AccountResponse[] {
    const needle = query.q.toLowerCase();
    return accounts.filter((acc) => {
        if (query.type !== "ALL" && acc.type !== query.type) return false;
        if (!needle) return true;
        return [acc.code, acc.name, acc.description].some((f) => f?.toLowerCase().includes(needle));
    });
}

export type TypeCounts = Record<TypeFilter, number>;

export function countByType(accounts: AccountResponse[]): TypeCounts {
    const counts: TypeCounts = { ALL: accounts.length, ASSET: 0, LIABILITY: 0, EQUITY: 0, REVENUE: 0, EXPENSE: 0 };
    for (const a of accounts) counts[a.type] += 1;
    return counts;
}

export { paginate, type PageWindow };
