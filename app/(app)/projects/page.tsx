import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../_components/AppTopbar";
import { Block } from "../_components/Block";
import { PageHeader } from "../_components/PageHeader";
import { listCustomers } from "@/lib/api/finance/customers-dal";
import { listProjects } from "@/lib/api/projects/projects-dal";
import { PROJECT_STATUSES, type ProjectStatus } from "@/lib/api/projects/projects";
import { ProjectsTable } from "./_components/ProjectsTable";
import { ProjectsToolbar } from "./_components/ProjectsToolbar";

export const metadata: Metadata = {
    title: "Projects · Tessera",
    description: "Engagements, billable work, and the budgets that keep them honest.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const parseStatus = (raw: string | string[] | undefined): ProjectStatus | "ALL" => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    return PROJECT_STATUSES.includes(v as ProjectStatus) ? (v as ProjectStatus) : "ALL";
};

const ProjectsListPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const activeStatus = parseStatus(sp.status);
    const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.toLowerCase() ?? "";

    const [customers, projects] = await Promise.all([listCustomers(), listProjects()]);

    const customerNameById = Object.fromEntries(customers.map((c) => [c.id, c.name]));

    const counts = {
        ALL: projects.length,
        PLANNED: projects.filter((p) => p.status === "PLANNED").length,
        ACTIVE: projects.filter((p) => p.status === "ACTIVE").length,
        ON_HOLD: projects.filter((p) => p.status === "ON_HOLD").length,
        CLOSED: projects.filter((p) => p.status === "CLOSED").length,
        CANCELLED: projects.filter((p) => p.status === "CANCELLED").length,
    };

    const filtered = projects.filter((p) => {
        if (activeStatus !== "ALL" && p.status !== activeStatus) return false;
        if (!q) return true;
        const customerName = p.customerId ? (customerNameById[p.customerId] ?? "") : "";
        const haystack = [p.projectNumber, p.name, p.description ?? "", customerName]
            .join(" ")
            .toLowerCase();
        return haystack.includes(q);
    });

    return (
        <>
            <AppTopbar crumbs={[{ label: "Projects" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Projects"
                        title={
                            <>
                                Projects<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Every engagement has a number, a lifecycle, and a story. PRJ-#### is assigned on creation. Statuses move planned → active → on hold or closed; cancellation is one-way."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/projects/new">
                                    <IconPlus stroke={1.8} />
                                    New project
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="Portfolio"
                        description={`${projects.length} project${projects.length === 1 ? "" : "s"} on the books.`}>
                        <div className="grid gap-4">
                            <ProjectsToolbar
                                activeStatus={activeStatus}
                                initialQ={q}
                                counts={counts}
                            />
                            <ProjectsTable
                                rows={filtered}
                                customerNameById={customerNameById}
                                detailHrefBase="/projects"
                            />
                        </div>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default ProjectsListPage;
