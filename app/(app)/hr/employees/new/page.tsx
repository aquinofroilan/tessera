import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { listDepartments } from "@/lib/api/hr/departments-dal";
import { NewEmployeeForm } from "./_components/NewEmployeeForm";

export const metadata: Metadata = {
    title: "New employee · Tessera",
};

const NewEmployeePage = async () => {
    const departments = await listDepartments(true);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "HR", href: "/hr" },
                    { label: "Employees", href: "/hr/employees" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Employees · New"
                        title="New employee"
                        description="EMP-#### is assigned on save. Department can be reassigned later from the employee detail page."
                    />
                    <NewEmployeeForm
                        departments={departments.map((d) => ({ id: d.id, code: d.code, name: d.name }))}
                    />
                </div>
            </div>
        </>
    );
};

export default NewEmployeePage;
