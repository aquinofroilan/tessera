import type { Metadata } from "next";
import Link from "next/link";
import {
    IconArrowRight,
    IconBeach,
    IconBriefcase2,
    IconBuilding,
    IconCalendarOff,
    IconCash,
    IconUsers,
} from "@tabler/icons-react";

import { Button, Card } from "@/components/ui";
import { AppTopbar } from "../_components/AppTopbar";
import { Block } from "../_components/Block";
import { PageHeader } from "../_components/PageHeader";

export const metadata: Metadata = {
    title: "HR · Tessera",
    description: "Employees, departments, and people operations.",
};

const HrDashboardPage = () => (
    <>
        <AppTopbar crumbs={[{ label: "HR" }]} />
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-400 p-9">
                <PageHeader
                    eyebrow="HR"
                    title={
                        <>
                            People<em className="text-(--accent) italic">.</em>
                        </>
                    }
                    description="Departments, employee records, and lifecycle. Time-off, positions, and payroll arrive on top of this foundation."
                />

                <Block title="Foundations" description="The pieces every other HR function depends on.">
                    <div className="grid gap-4">
                        <Card className="p-6">
                            <div className="flex items-start gap-5">
                                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--ink-soft)">
                                    <IconUsers className="size-5" stroke={1.6} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="font-display text-[15px] font-[420] tracking-[-0.01em] text-(--ink)">
                                        Employees
                                    </div>
                                    <div className="mt-1 text-[13px] text-(--muted)">
                                        Roster, hire dates, status (active / on leave / terminated), and department
                                        assignment. EMP-#### numbering is automatic.
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/hr/employees">
                                        Open
                                        <IconArrowRight stroke={1.8} />
                                    </Link>
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-start gap-5">
                                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--ink-soft)">
                                    <IconBuilding className="size-5" stroke={1.6} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="font-display text-[15px] font-[420] tracking-[-0.01em] text-(--ink)">
                                        Departments
                                    </div>
                                    <div className="mt-1 text-[13px] text-(--muted)">
                                        Org structure. Codes are unique per organization; deactivating preserves
                                        historical assignments.
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/hr/departments">
                                        Open
                                        <IconArrowRight stroke={1.8} />
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    </div>
                </Block>

                <Block title="Time off" description="Requests, balances, and the categories that govern them.">
                    <div className="grid gap-4">
                        <Card className="p-6">
                            <div className="flex items-start gap-5">
                                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--ink-soft)">
                                    <IconCalendarOff className="size-5" stroke={1.6} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="font-display text-[15px] font-[420] tracking-[-0.01em] text-(--ink)">
                                        Leave requests
                                    </div>
                                    <div className="mt-1 text-[13px] text-(--muted)">
                                        File, approve, reject, or cancel time-off requests. Approving a request that
                                        covers today places the employee on leave automatically.
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/hr/leave-requests">
                                        Open
                                        <IconArrowRight stroke={1.8} />
                                    </Link>
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-start gap-5">
                                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--ink-soft)">
                                    <IconBeach className="size-5" stroke={1.6} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="font-display text-[15px] font-[420] tracking-[-0.01em] text-(--ink)">
                                        Leave types
                                    </div>
                                    <div className="mt-1 text-[13px] text-(--muted)">
                                        Categories of time away — paid or unpaid — each with its own annual
                                        entitlement.
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/hr/leave-types">
                                        Open
                                        <IconArrowRight stroke={1.8} />
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    </div>
                </Block>

                <Block title="Roles & pay" description="The catalog of positions employees can fill.">
                    <Card className="p-6">
                        <div className="flex items-start gap-5">
                            <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--ink-soft)">
                                <IconBriefcase2 className="size-5" stroke={1.6} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="font-display text-[15px] font-[420] tracking-[-0.01em] text-(--ink)">
                                    Positions
                                </div>
                                <div className="mt-1 text-[13px] text-(--muted)">
                                    Job titles tied optionally to a department and a pay grade. Compensation
                                    records reference positions when set.
                                </div>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/hr/positions">
                                    Open
                                    <IconArrowRight stroke={1.8} />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </Block>

                <Block title="Payroll" description="Period runs that snapshot compensation and post to the GL.">
                    <Card className="p-6">
                        <div className="flex items-start gap-5">
                            <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--ink-soft)">
                                <IconCash className="size-5" stroke={1.6} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="font-display text-[15px] font-[420] tracking-[-0.01em] text-(--ink)">
                                    Payroll runs
                                </div>
                                <div className="mt-1 text-[13px] text-(--muted)">
                                    Draft, approve, and pay. Approval posts a salary accrual (Dr 6000 / Cr 2200);
                                    payment posts the cash leg (Dr 2200 / Cr 1000). Both link to the underlying
                                    journal entry.
                                </div>
                            </div>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/hr/payroll-runs">
                                    Open
                                    <IconArrowRight stroke={1.8} />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </Block>
            </div>
        </div>
    </>
);

export default HrDashboardPage;
