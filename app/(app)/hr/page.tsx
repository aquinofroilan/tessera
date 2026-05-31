import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconBuilding, IconUsers } from "@tabler/icons-react";

import { Button, Card } from "@/components/ui";
import { AppTopbar } from "../_components/AppTopbar";
import { Block } from "../_components/Block";
import { PageHeader } from "../_components/PageHeader";

export const metadata: Metadata = {
    title: "HR · Loom",
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
            </div>
        </div>
    </>
);

export default HrDashboardPage;
