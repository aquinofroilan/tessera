"use client";

import type { PayrollRunStatus } from "@/lib/api/hr/payroll-runs";
import { StatusToolbar, type StatusToolbarTab } from "../../finance/_components/StatusToolbar";

type Props = {
    activeStatus: PayrollRunStatus | "ALL";
    initialQ: string;
    counts: Record<PayrollRunStatus | "ALL", number>;
};

const tabs: StatusToolbarTab<PayrollRunStatus>[] = [
    { value: "ALL", label: "All" },
    { value: "DRAFT", label: "Draft" },
    { value: "APPROVED", label: "Approved" },
    { value: "PAID", label: "Paid" },
    { value: "CANCELLED", label: "Cancelled" },
];

export const PayrollRunsToolbar = ({ activeStatus, initialQ, counts }: Props) => (
    <StatusToolbar
        tabs={tabs}
        activeStatus={activeStatus}
        initialQ={initialQ}
        counts={counts}
        searchPlaceholder="Search run number, period…"
        searchAriaLabel="Search payroll runs"
        tabsAriaLabel="Filter by status"
        paramKey="status"
    />
);
