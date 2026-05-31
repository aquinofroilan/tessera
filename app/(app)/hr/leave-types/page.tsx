import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { listLeaveTypes } from "@/lib/api/hr/leave-types-dal";
import { LeaveTypesTable } from "../_components/LeaveTypesTable";

export const metadata: Metadata = {
    title: "Leave types · Loom",
    description: "Categories of time off employees can request.",
};

const LeaveTypesListPage = async () => {
    const types = await listLeaveTypes();

    return (
        <>
            <AppTopbar crumbs={[{ label: "HR", href: "/hr" }, { label: "Leave types" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR"
                        title={
                            <>
                                Leave types<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Categories of time away — paid or unpaid — each with its own default annual entitlement. Balances are tracked per type, per employee, per year."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/hr/leave-types/new">
                                    <IconPlus stroke={1.8} />
                                    New leave type
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="All leave types"
                        description={`${types.length} leave type${types.length === 1 ? "" : "s"}.`}>
                        <LeaveTypesTable rows={types} detailHrefBase="/hr/leave-types" />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default LeaveTypesListPage;
