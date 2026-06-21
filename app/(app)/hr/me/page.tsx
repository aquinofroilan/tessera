import type { Metadata } from "next";
import Link from "next/link";

import { Button, Card } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { listLeaveTypes } from "@/lib/api/hr/leave-types-dal";
import {
    getMyCurrentCompensation,
    getMyProfile,
    listMyCompensationHistory,
    listMyLeaveRequests,
} from "@/lib/api/hr/self-service-dal";
import { CompensationTable } from "../_components/CompensationTable";
import { EmployeeStatusBadge } from "../_components/EmployeeStatusBadge";
import { LeaveRequestStatusBadge } from "../_components/LeaveRequestStatusBadge";
import { ProfileGrid, type ProfileRow } from "../_components/ProfileGrid";
import { SelfLeaveForm } from "./_components/SelfLeaveForm";

export const metadata: Metadata = {
    title: "My profile · Tessera",
    description: "Your employee profile, leave, and compensation.",
};

const SelfServicePage = async () => {
    const profile = await getMyProfile();

    if (!profile) {
        return (
            <>
                <AppTopbar crumbs={[{ label: "HR", href: "/hr" }, { label: "My profile" }]} />
                <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-400 p-9">
                        <PageHeader
                            eyebrow="HR · Self-service"
                            title={
                                <>
                                    My profile<em className="text-(--accent) italic">.</em>
                                </>
                            }
                            description="Your own employee record, leave history, and compensation."
                        />
                        <Card className="items-center gap-3 px-6 py-12 text-center">
                            <div className="font-display text-foreground text-xl font-[380]">
                                Your user isn&rsquo;t linked to an employee yet.
                            </div>
                            <p className="max-w-80 text-sm text-(--muted)">
                                Ask your HR lead to attach an employee record to your account.
                            </p>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/hr/employees">Browse employees</Link>
                            </Button>
                        </Card>
                    </div>
                </div>
            </>
        );
    }

    const [leaveTypes, leaveRequests, compHistory, currentComp] = await Promise.all([
        listLeaveTypes(true),
        listMyLeaveRequests(),
        listMyCompensationHistory(),
        getMyCurrentCompensation().catch(() => null),
    ]);

    const leaveTypeNameById = Object.fromEntries(leaveTypes.map((t) => [t.id, t.name]));
    const sortedComp = [...compHistory].sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate));
    const recentLeave = [...leaveRequests]
        .sort((a, b) => (a.createdAt && b.createdAt ? b.createdAt.localeCompare(a.createdAt) : 0))
        .slice(0, 8);

    const profileRows: ProfileRow[] = [
        { label: "Employee number", value: profile.employeeNumber },
        { label: "Email", value: profile.email ?? "—" },
        { label: "Job title", value: profile.jobTitle ?? "—" },
        { label: "Hired", value: profile.hireDate },
        { label: "Status", value: <EmployeeStatusBadge status={profile.status} /> },
        {
            label: "Current pay",
            value: currentComp ? `${currentComp.payRate} ${currentComp.currency} / ${currentComp.payPeriod.toLowerCase()}` : "—",
        },
    ];

    return (
        <>
            <AppTopbar crumbs={[{ label: "HR", href: "/hr" }, { label: "My profile" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Self-service"
                        title={
                            <>
                                {profile.firstName} {profile.lastName}
                                <em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description={profile.jobTitle ?? `Hired ${profile.hireDate}.`}
                    />

                    <Block title="Profile" description="What HR has on file for you.">
                        <ProfileGrid rows={profileRows} />
                    </Block>

                    <Block
                        title="Request leave"
                        description="Submit a request for your HR lead to approve. Status updates as soon as they decide.">
                        <SelfLeaveForm leaveTypes={leaveTypes.map((t) => ({ id: t.id, name: t.name }))} />
                    </Block>

                    <Block
                        title="My leave requests"
                        description={`${leaveRequests.length} total — showing the ${recentLeave.length} most recent.`}>
                        {recentLeave.length ? (
                            <Card className="grid divide-y divide-(--rule) p-0">
                                {recentLeave.map((req) => (
                                    <div key={req.id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-4">
                                        <div className="grid gap-1">
                                            <div className="text-foreground text-[14px] font-medium">
                                                {leaveTypeNameById[req.leaveTypeId] ?? "Leave"}
                                            </div>
                                            <div className="font-mono text-[11px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                                {req.startDate} → {req.endDate} · {req.days} day{req.days === 1 ? "" : "s"}
                                            </div>
                                            {req.reason && (
                                                <div className="text-(--muted) text-[12px]">{req.reason}</div>
                                            )}
                                        </div>
                                        <LeaveRequestStatusBadge status={req.status} />
                                    </div>
                                ))}
                            </Card>
                        ) : (
                            <Card className="px-6 py-12 text-center text-[13px] text-(--muted)">
                                You haven&rsquo;t submitted any leave requests yet.
                            </Card>
                        )}
                    </Block>

                    {sortedComp.length > 0 && (
                        <Block
                            title="Compensation history"
                            description="Effective-dated. The most recent record on or before today is current.">
                            <CompensationTable
                                rows={sortedComp}
                                positions={[]}
                                currentId={currentComp?.id ?? null}
                            />
                        </Block>
                    )}
                </div>
            </div>
        </>
    );
};

export default SelfServicePage;
