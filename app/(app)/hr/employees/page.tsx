import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { listDepartments } from "@/lib/api/hr/departments-dal";
import { listEmployees } from "@/lib/api/hr/employees-dal";
import type { EmploymentStatus } from "@/lib/api/hr/employees";
import { EmployeesTable } from "../_components/EmployeesTable";
import { EmployeesToolbar } from "../_components/EmployeesToolbar";

export const metadata: Metadata = {
    title: "Employees · Loom",
    description: "Roster, hire dates, lifecycle status, and department assignment.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const STATUSES: readonly EmploymentStatus[] = ["ACTIVE", "ON_LEAVE", "TERMINATED"];

const parseStatus = (raw: string | string[] | undefined): EmploymentStatus | "ALL" => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    return STATUSES.includes(v as EmploymentStatus) ? (v as EmploymentStatus) : "ALL";
};

const EmployeesListPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const activeStatus = parseStatus(sp.status);
    const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.toLowerCase() ?? "";

    const [departments, employees] = await Promise.all([listDepartments(), listEmployees()]);

    const departmentNameById = Object.fromEntries(departments.map((d) => [d.id, d.name]));

    const counts = {
        ALL: employees.length,
        ACTIVE: employees.filter((e) => e.status === "ACTIVE").length,
        ON_LEAVE: employees.filter((e) => e.status === "ON_LEAVE").length,
        TERMINATED: employees.filter((e) => e.status === "TERMINATED").length,
    };

    const filtered = employees.filter((e) => {
        if (activeStatus !== "ALL" && e.status !== activeStatus) return false;
        if (!q) return true;
        const haystack = [
            e.employeeNumber,
            e.firstName,
            e.lastName,
            e.jobTitle ?? "",
            e.email ?? "",
        ]
            .join(" ")
            .toLowerCase();
        return haystack.includes(q);
    });

    return (
        <>
            <AppTopbar crumbs={[{ label: "HR", href: "/hr" }, { label: "Employees" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR"
                        title={
                            <>
                                Employees<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="The roster. Employee numbers (EMP-####) are assigned at hire and never reused. Status reflects lifecycle — active, on leave, or terminated."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/hr/employees/new">
                                    <IconPlus stroke={1.8} />
                                    New employee
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="Roster"
                        description={`${employees.length} employee${employees.length === 1 ? "" : "s"} on record.`}>
                        <div className="grid gap-4">
                            <EmployeesToolbar activeStatus={activeStatus} initialQ={q} counts={counts} />
                            <EmployeesTable
                                rows={filtered}
                                departmentNameById={departmentNameById}
                                detailHrefBase="/hr/employees"
                            />
                        </div>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default EmployeesListPage;
