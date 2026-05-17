import { paginate, type PageWindow } from "./list-query";

export type PartyScope = "ALL" | "ACTIVE" | "ARCHIVED";

export type PartiesQuery = {
    scope: PartyScope;
    q: string;
    page: number;
};

type PartyLike = {
    name: string;
    contactName: string | null;
    contactEmail: string | null;
    isActive: boolean;
};

export const parsePartiesQuery = (searchParams: Record<string, string | string[] | undefined>): PartiesQuery => {
    const scopeRaw = (Array.isArray(searchParams.scope) ? searchParams.scope[0] : searchParams.scope) ?? "ACTIVE";
    const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q) ?? "";
    const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
    const page = Math.max(1, Number(pageRaw) || 1);
    const scope: PartyScope =
        scopeRaw === "ALL" || scopeRaw === "ACTIVE" || scopeRaw === "ARCHIVED" ? scopeRaw : "ACTIVE";
    return { scope, q: q.trim(), page };
};

export const filterParties = <T extends PartyLike>(parties: T[], query: PartiesQuery): T[] => {
    const needle = query.q.toLowerCase();
    return parties.filter((party) => {
        if (query.scope === "ACTIVE" && !party.isActive) return false;
        if (query.scope === "ARCHIVED" && party.isActive) return false;
        if (!needle) return true;
        return [party.name, party.contactName, party.contactEmail].some((f) => f?.toLowerCase().includes(needle));
    });
};

export const countParties = (parties: PartyLike[]): { ALL: number; ACTIVE: number; ARCHIVED: number } => {
    let active = 0;
    let archived = 0;
    for (const p of parties) {
        if (p.isActive) active += 1;
        else archived += 1;
    }
    return { ALL: parties.length, ACTIVE: active, ARCHIVED: archived };
};

export { paginate, type PageWindow };
