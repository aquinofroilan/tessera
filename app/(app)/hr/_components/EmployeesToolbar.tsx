"use client";

import type { EmploymentStatus } from "@/lib/api/hr/employees";
import { StatusToolbar, type StatusToolbarTab } from "../../finance/_components/StatusToolbar";

type Props = {
    activeStatus: EmploymentStatus | "ALL";
    initialQ: string;
    counts: Record<EmploymentStatus | "ALL", number>;
};

const tabs: StatusToolbarTab<EmploymentStatus>[] = [
    { value: "ALL", label: "All" },
    { value: "ACTIVE", label: "Active" },
    { value: "ON_LEAVE", label: "On leave" },
    { value: "TERMINATED", label: "Terminated" },
];

export const EmployeesToolbar = ({ activeStatus, initialQ, counts }: Props) => (
    <StatusToolbar
        tabs={tabs}
        activeStatus={activeStatus}
        initialQ={initialQ}
        counts={counts}
        searchPlaceholder="Search name, number, title…"
        searchAriaLabel="Search employees"
        tabsAriaLabel="Filter by status"
        paramKey="status"
    />
);
