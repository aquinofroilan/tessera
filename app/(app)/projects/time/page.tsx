import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { listEmployees } from "@/lib/api/hr/employees-dal";
import { listProjects } from "@/lib/api/projects/projects-dal";
import { listTimeEntries } from "@/lib/api/projects/time-entries-dal";
import {
    TIME_ENTRY_STATUSES,
    type TimeEntryStatus,
} from "@/lib/api/projects/time-entries";
import { TimeEntriesTable } from "../_components/TimeEntriesTable";
import { TimeEntriesToolbar } from "../_components/TimeEntriesToolbar";

export const metadata: Metadata = {
    title: "Time entries · Tessera",
    description: "Logged time across projects. Submit drafts, approve queue, audit history.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const parseStatus = (raw: string | string[] | undefined): TimeEntryStatus | "ALL" => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    return TIME_ENTRY_STATUSES.includes(v as TimeEntryStatus) ? (v as TimeEntryStatus) : "ALL";
};

const TimeEntriesListPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const activeStatus = parseStatus(sp.status);
    const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.toLowerCase() ?? "";

    const [employees, projects, entries] = await Promise.all([
        listEmployees(),
        listProjects(),
        listTimeEntries(),
    ]);

    const employeeById = Object.fromEntries(
        employees.map((e) => [
            e.id,
            { employeeNumber: e.employeeNumber, firstName: e.firstName, lastName: e.lastName },
        ]),
    );
    const projectById = Object.fromEntries(
        projects.map((p) => [p.id, { projectNumber: p.projectNumber, name: p.name }]),
    );

    const counts = {
        ALL: entries.length,
        DRAFT: entries.filter((e) => e.status === "DRAFT").length,
        SUBMITTED: entries.filter((e) => e.status === "SUBMITTED").length,
        APPROVED: entries.filter((e) => e.status === "APPROVED").length,
        REJECTED: entries.filter((e) => e.status === "REJECTED").length,
    };

    const filtered = entries.filter((e) => {
        if (activeStatus !== "ALL" && e.status !== activeStatus) return false;
        if (!q) return true;
        const emp = employeeById[e.employeeId];
        const proj = projectById[e.projectId];
        const haystack = [
            emp ? `${emp.firstName} ${emp.lastName} ${emp.employeeNumber}` : "",
            proj ? `${proj.projectNumber} ${proj.name}` : "",
            e.notes ?? "",
        ]
            .join(" ")
            .toLowerCase();
        return haystack.includes(q);
    });

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Projects", href: "/projects" },
                    { label: "Time" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Projects · Time"
                        title={
                            <>
                                Time entries<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Every hour logged against a project lives here. Drafts are editable; submitted entries wait for approval; approved billable lines feed T&M invoices."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/projects/time/new">
                                    <IconPlus stroke={1.8} />
                                    Log time
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="Entries"
                        description={`${entries.length} entr${entries.length === 1 ? "y" : "ies"} on record.`}
                        aside={
                            <Button asChild variant="outline" size="sm">
                                <Link href="/projects/time/approvals">Approval queue</Link>
                            </Button>
                        }>
                        <div className="grid gap-4">
                            <TimeEntriesToolbar
                                activeStatus={activeStatus}
                                initialQ={q}
                                counts={counts}
                            />
                            <TimeEntriesTable
                                rows={filtered}
                                employeeById={employeeById}
                                projectById={projectById}
                            />
                        </div>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default TimeEntriesListPage;
