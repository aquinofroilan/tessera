import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { listEmployees } from "@/lib/api/hr/employees-dal";
import { listLeaveTypes } from "@/lib/api/hr/leave-types-dal";
import { listLeaveRequests } from "@/lib/api/hr/leave-requests-dal";
import type { LeaveRequestStatus } from "@/lib/api/hr/leave-requests";
import { LeaveRequestsTable } from "../_components/LeaveRequestsTable";
import { LeaveRequestsToolbar } from "../_components/LeaveRequestsToolbar";

export const metadata: Metadata = {
    title: "Leave requests · Loom",
    description: "Time-off requests, approvals, and balances.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const STATUSES: readonly LeaveRequestStatus[] = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"];

const parseStatus = (raw: string | string[] | undefined): LeaveRequestStatus | "ALL" => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    return STATUSES.includes(v as LeaveRequestStatus) ? (v as LeaveRequestStatus) : "ALL";
};

const LeaveRequestsListPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const activeStatus = parseStatus(sp.status);
    const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.toLowerCase() ?? "";

    const [requests, employees, types] = await Promise.all([
        listLeaveRequests(),
        listEmployees(),
        listLeaveTypes(),
    ]);

    const employeeNameById = Object.fromEntries(
        employees.map((e) => [e.id, `${e.firstName} ${e.lastName}`]),
    );
    const leaveTypeNameById = Object.fromEntries(types.map((t) => [t.id, t.name]));

    const counts = {
        ALL: requests.length,
        PENDING: requests.filter((r) => r.status === "PENDING").length,
        APPROVED: requests.filter((r) => r.status === "APPROVED").length,
        REJECTED: requests.filter((r) => r.status === "REJECTED").length,
        CANCELLED: requests.filter((r) => r.status === "CANCELLED").length,
    };

    const filtered = requests.filter((r) => {
        if (activeStatus !== "ALL" && r.status !== activeStatus) return false;
        if (!q) return true;
        const haystack = [
            employeeNameById[r.employeeId] ?? "",
            leaveTypeNameById[r.leaveTypeId] ?? "",
            r.reason ?? "",
        ]
            .join(" ")
            .toLowerCase();
        return haystack.includes(q);
    });

    return (
        <>
            <AppTopbar crumbs={[{ label: "HR", href: "/hr" }, { label: "Leave requests" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR"
                        title={
                            <>
                                Leave requests<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Requested time off — pending, approved, rejected, or cancelled. Approving a request that covers today flips the employee to On leave automatically."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/hr/leave-requests/new">
                                    <IconPlus stroke={1.8} />
                                    New request
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="All requests"
                        description={`${requests.length} request${requests.length === 1 ? "" : "s"} on record.`}>
                        <div className="grid gap-4">
                            <LeaveRequestsToolbar activeStatus={activeStatus} initialQ={q} counts={counts} />
                            <LeaveRequestsTable
                                rows={filtered}
                                employeeNameById={employeeNameById}
                                leaveTypeNameById={leaveTypeNameById}
                                detailHrefBase="/hr/leave-requests"
                            />
                        </div>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default LeaveRequestsListPage;
