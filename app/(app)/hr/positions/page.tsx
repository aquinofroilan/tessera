import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { listDepartments } from "@/lib/api/hr/departments-dal";
import { listPositions } from "@/lib/api/hr/positions-dal";
import { PositionsTable } from "../_components/PositionsTable";

export const metadata: Metadata = {
    title: "Positions · Loom",
    description: "Job titles, pay grades, and the departments that own them.",
};

const PositionsListPage = async () => {
    const [positions, departments] = await Promise.all([listPositions(), listDepartments()]);
    const departmentNameById = Object.fromEntries(departments.map((d) => [d.id, d.name]));

    return (
        <>
            <AppTopbar crumbs={[{ label: "HR", href: "/hr" }, { label: "Positions" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR"
                        title={
                            <>
                                Positions<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="The job catalog. Positions optionally link to a department and a pay grade — compensation records reference them, but the link is informational, not binding."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/hr/positions/new">
                                    <IconPlus stroke={1.8} />
                                    New position
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="All positions"
                        description={`${positions.length} position${positions.length === 1 ? "" : "s"}.`}>
                        <PositionsTable
                            rows={positions}
                            departmentNameById={departmentNameById}
                            detailHrefBase="/hr/positions"
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default PositionsListPage;
