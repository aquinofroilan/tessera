import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button, Card } from "@/components/ui";
import type { LeaveBalanceResponse, LeaveRequestResponse } from "@/lib/api/hr/leave-requests";
import type { LeaveTypeResponse } from "@/lib/api/hr/leave-types";
import { LeaveRequestStatusBadge } from "../../../_components/LeaveRequestStatusBadge";

type Props = {
    employeeId: string;
    leaveTypes: LeaveTypeResponse[];
    balances: LeaveBalanceResponse[];
    recentRequests: LeaveRequestResponse[];
    year: number;
};

export const EmployeeLeaveBlock = ({
    employeeId,
    leaveTypes,
    balances,
    recentRequests,
    year,
}: Props) => {
    const leaveTypeNameById = Object.fromEntries(leaveTypes.map((t) => [t.id, t.name]));

    return (
        <div className="grid gap-4">
            <Card className="p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <div className="font-display text-[15px] font-[420] tracking-[-0.01em] text-(--ink)">
                            Balances · {year}
                        </div>
                        <div className="mt-0.5 text-[12px] text-(--muted)">
                            Entitlement minus approved days, per leave type.
                        </div>
                    </div>
                    <Button asChild variant="default" size="sm">
                        <Link href={`/hr/leave-requests/new?employeeId=${employeeId}`}>
                            <IconPlus stroke={1.8} />
                            File request
                        </Link>
                    </Button>
                </div>
                {balances.length === 0 ? (
                    <div className="text-[13px] text-(--muted)">No active leave types yet.</div>
                ) : (
                    <div className="grid gap-3 md:grid-cols-3">
                        {balances.map((b) => (
                            <div
                                key={b.leaveTypeId}
                                className="rounded-lg border border-(--rule) bg-(--paper) p-4">
                                <div className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                                    {leaveTypeNameById[b.leaveTypeId] ?? b.leaveTypeId}
                                </div>
                                <div className="mt-2 flex items-baseline gap-1.5">
                                    <span className="font-display text-2xl font-[420] text-(--ink) tabular-nums">
                                        {b.remainingDays}
                                    </span>
                                    <span className="text-[12px] text-(--muted)">
                                        of {b.entitlementDays} day{b.entitlementDays === 1 ? "" : "s"}
                                    </span>
                                </div>
                                <div className="mt-1 text-[11px] text-(--muted)">
                                    {b.usedDays} used
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <Card className="p-6">
                <div className="mb-3 font-display text-[15px] font-[420] tracking-[-0.01em] text-(--ink)">
                    Recent requests
                </div>
                {recentRequests.length === 0 ? (
                    <div className="text-[13px] text-(--muted)">None on file.</div>
                ) : (
                    <ul className="grid list-none gap-2 p-0">
                        {recentRequests.map((r) => (
                            <li
                                key={r.id}
                                className="flex items-center justify-between gap-3 border-b border-(--rule) py-2 last:border-b-0">
                                <Link
                                    href={`/hr/leave-requests/${r.id}`}
                                    className="font-medium text-(--ink) hover:text-(--accent)">
                                    {leaveTypeNameById[r.leaveTypeId] ?? r.leaveTypeId}
                                </Link>
                                <span className="font-mono text-[12px] tabular-nums text-(--ink-soft)">
                                    {r.startDate} → {r.endDate}
                                </span>
                                <span className="font-mono text-[12px] tabular-nums text-(--ink-soft)">
                                    {r.days}d
                                </span>
                                <LeaveRequestStatusBadge status={r.status} />
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
};
