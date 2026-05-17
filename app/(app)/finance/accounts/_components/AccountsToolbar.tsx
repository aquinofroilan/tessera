"use client";

import type { AccountType } from "@/lib/api/finance/accounts";
import { StatusToolbar, type StatusToolbarTab } from "../../_components/StatusToolbar";
import type { TypeCounts, TypeFilter } from "../_data/filter";

const tabs: StatusToolbarTab<AccountType>[] = [
    { value: "ALL", label: "All" },
    { value: "ASSET", label: "Assets" },
    { value: "LIABILITY", label: "Liabilities" },
    { value: "EQUITY", label: "Equity" },
    { value: "REVENUE", label: "Revenue" },
    { value: "EXPENSE", label: "Expenses" },
];

type ToolbarProps = {
    activeType: TypeFilter;
    initialQ: string;
    counts: TypeCounts;
};

export function AccountsToolbar({ activeType, initialQ, counts }: ToolbarProps) {
    return (
        <StatusToolbar
            tabs={tabs}
            activeStatus={activeType}
            initialQ={initialQ}
            counts={counts}
            searchPlaceholder="Search code, name, or description…"
            searchAriaLabel="Search accounts"
            tabsAriaLabel="Filter by account type"
            paramKey="type"
        />
    );
}
