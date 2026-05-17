"use client";

import { StatusToolbar, type StatusToolbarTab } from "./StatusToolbar";

type PartyScope = "ALL" | "ACTIVE" | "ARCHIVED";

type ToolbarProps = {
    activeScope: PartyScope;
    initialQ: string;
    counts: { ALL: number; ACTIVE: number; ARCHIVED: number };
    searchPlaceholder: string;
    searchAriaLabel: string;
};

const tabs: StatusToolbarTab<PartyScope>[] = [
    { value: "ALL", label: "All" },
    { value: "ACTIVE", label: "Active" },
    { value: "ARCHIVED", label: "Archived" },
];

export const PartiesToolbar = ({
    activeScope,
    initialQ,
    counts,
    searchPlaceholder,
    searchAriaLabel,
}: ToolbarProps) => (
    <StatusToolbar
        tabs={tabs}
        activeStatus={activeScope}
        initialQ={initialQ}
        counts={counts}
        searchPlaceholder={searchPlaceholder}
        searchAriaLabel={searchAriaLabel}
        tabsAriaLabel="Filter scope"
        paramKey="scope"
        clearValue="ACTIVE"
    />
);
