import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { listPayrollRuns } from "@/lib/api/hr/payroll-runs-dal";
import type { PayrollRunStatus } from "@/lib/api/hr/payroll-runs";
import { PayrollRunsTable } from "../_components/PayrollRunsTable";
import { PayrollRunsToolbar } from "../_components/PayrollRunsToolbar";

export const metadata: Metadata = {
    title: "Payroll runs · Tessera",
    description: "Periodic payroll snapshots, with GL postings for accrual and payment.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const STATUSES: readonly PayrollRunStatus[] = ["DRAFT", "APPROVED", "PAID", "CANCELLED"];

const parseStatus = (raw: string | string[] | undefined): PayrollRunStatus | "ALL" => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    return STATUSES.includes(v as PayrollRunStatus) ? (v as PayrollRunStatus) : "ALL";
};

const PayrollRunsListPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const activeStatus = parseStatus(sp.status);
    const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.toLowerCase() ?? "";

    const runs = await listPayrollRuns();

    const counts = {
        ALL: runs.length,
        DRAFT: runs.filter((r) => r.status === "DRAFT").length,
        APPROVED: runs.filter((r) => r.status === "APPROVED").length,
        PAID: runs.filter((r) => r.status === "PAID").length,
        CANCELLED: runs.filter((r) => r.status === "CANCELLED").length,
    };

    const filtered = runs.filter((r) => {
        if (activeStatus !== "ALL" && r.status !== activeStatus) return false;
        if (!q) return true;
        const haystack = [r.runNumber, r.periodStart, r.periodEnd, r.payDate].join(" ").toLowerCase();
        return haystack.includes(q);
    });

    return (
        <>
            <AppTopbar crumbs={[{ label: "HR", href: "/hr" }, { label: "Payroll runs" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR"
                        title={
                            <>
                                Payroll runs<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Period-bound payroll snapshots. Approving posts the accrual (Dr 6000 / Cr 2200); paying posts the cash side (Dr 2200 / Cr 1000). Both link back to the underlying journal entry."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/hr/payroll-runs/new">
                                    <IconPlus stroke={1.8} />
                                    New run
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="All runs"
                        description={`${runs.length} run${runs.length === 1 ? "" : "s"} on record.`}>
                        <div className="grid gap-4">
                            <PayrollRunsToolbar
                                activeStatus={activeStatus}
                                initialQ={q}
                                counts={counts}
                            />
                            <PayrollRunsTable rows={filtered} detailHrefBase="/hr/payroll-runs" />
                        </div>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default PayrollRunsListPage;
