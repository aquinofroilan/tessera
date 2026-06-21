import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { listDepartmentOrgChart } from "@/lib/api/hr/departments-dal";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { OrgChartTree } from "./_components/OrgChartTree";

export const metadata: Metadata = {
    title: "Org chart · Tessera",
    description: "Department hierarchy rolled up from active departments.",
};

const countNodes = (nodes: { children: { children: unknown[] }[] }[]): number =>
    nodes.reduce(
        (acc, n) =>
            acc +
            1 +
            countNodes(
                (n.children as unknown as { children: { children: unknown[] }[] }[]) ?? [],
            ),
        0,
    );

const OrgChartPage = async () => {
    const tree = await listDepartmentOrgChart();
    const total = countNodes(tree);
    const roots = tree.length;

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "HR", href: "/hr" },
                    { label: "Departments", href: "/hr/departments" },
                    { label: "Org chart" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Departments"
                        title={
                            <>
                                Org chart<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Department hierarchy, top-level first. Click any node to open the detail page."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/hr/departments/new">
                                    <IconPlus stroke={1.8} />
                                    New department
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="Hierarchy"
                        description={`${total} department${total === 1 ? "" : "s"} across ${roots} top-level group${roots === 1 ? "" : "s"}.`}>
                        <OrgChartTree nodes={tree} />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default OrgChartPage;
