import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { listDepartments } from "@/lib/api/hr/departments-dal";
import { DepartmentsTable } from "../_components/DepartmentsTable";

export const metadata: Metadata = {
    title: "Departments · Loom",
    description: "The org structure people are assigned to.",
};

const DepartmentsListPage = async () => {
    const departments = await listDepartments();

    return (
        <>
            <AppTopbar crumbs={[{ label: "HR", href: "/hr" }, { label: "Departments" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR"
                        title={
                            <>
                                Departments<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="The org structure people sit inside. Codes are unique per organization. Deactivating preserves history — past assignments still resolve."
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
                        title="All departments"
                        description={`${departments.length} department${departments.length === 1 ? "" : "s"}.`}>
                        <DepartmentsTable rows={departments} detailHrefBase="/hr/departments" />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default DepartmentsListPage;
