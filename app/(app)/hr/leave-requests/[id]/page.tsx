import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { getEmployee } from "@/lib/api/hr/employees-dal";
import { getLeaveType } from "@/lib/api/hr/leave-types-dal";
import { getLeaveBalance, getLeaveRequest } from "@/lib/api/hr/leave-requests-dal";
import { LeaveRequestStatusBadge } from "../../_components/LeaveRequestStatusBadge";
import { ProfileGrid, type ProfileRow } from "../../_components/ProfileGrid";
import { DecisionActions } from "./_components/DecisionActions";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const request = await getLeaveRequest(id);
    return {
        title: request ? `Leave request · ${request.startDate} · Tessera` : "Leave request · Tessera",
    };
};

const LeaveRequestDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const request = await getLeaveRequest(id);
    if (!request) notFound();

    const [employee, leaveType] = await Promise.all([
        getEmployee(request.employeeId),
        getLeaveType(request.leaveTypeId),
    ]);

    const year = new Date(request.startDate).getUTCFullYear();
    const balance = await getLeaveBalance(request.employeeId, request.leaveTypeId, year).catch(
        () => null,
    );

    const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : request.employeeId;
    const leaveTypeName = leaveType?.name ?? request.leaveTypeId;

    const profile: ProfileRow[] = [
        {
            label: "Employee",
            value: employee ? (
                <Link href={`/hr/employees/${employee.id}`} className="hover:text-(--accent)">
                    {employeeName}
                </Link>
            ) : (
                employeeName
            ),
        },
        {
            label: "Leave type",
            value: leaveType ? (
                <Link href={`/hr/leave-types/${leaveType.id}`} className="hover:text-(--accent)">
                    {leaveTypeName}
                </Link>
            ) : (
                leaveTypeName
            ),
        },
        { label: "Start", value: request.startDate },
        { label: "End", value: request.endDate },
        { label: "Days", value: String(request.days) },
        { label: "Reason", value: request.reason ?? "—" },
        { label: "Requested by", value: request.requestedBy },
        { label: "Decided by", value: request.decidedBy ?? "—" },
        { label: "Decision note", value: request.decisionReason ?? "—" },
    ];

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "HR", href: "/hr" },
                    { label: "Leave requests", href: "/hr/leave-requests" },
                    { label: `${request.startDate} → ${request.endDate}` },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Leave requests"
                        title={`${employeeName} · ${leaveTypeName}`}
                        description={`${request.days} day${request.days === 1 ? "" : "s"} from ${request.startDate} through ${request.endDate}.`}
                        actions={<LeaveRequestStatusBadge status={request.status} />}
                    />

                    <Block title="Profile" description="Request details and decision audit.">
                        <ProfileGrid rows={profile} />
                    </Block>

                    {balance && (
                        <Block
                            title="Balance"
                            description={`Entitlement vs. used for ${employeeName} · ${leaveTypeName} · ${balance.year}.`}>
                            <ProfileGrid
                                rows={[
                                    { label: "Entitlement", value: `${balance.entitlementDays} days` },
                                    { label: "Used", value: `${balance.usedDays} days` },
                                    { label: "Remaining", value: `${balance.remainingDays} days` },
                                ]}
                            />
                        </Block>
                    )}

                    <Block
                        title="Decision"
                        description="Approve or reject pending requests. Approved or rejected requests can no longer be cancelled.">
                        <DecisionActions requestId={request.id} status={request.status} />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default LeaveRequestDetailPage;
