import type { Metadata } from "next";

import { listDepartments } from "@/lib/api/hr/departments-dal";
import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { NewDepartmentForm } from "./_components/NewDepartmentForm";

export const metadata: Metadata = {
    title: "New department · Tessera",
};

const NewDepartmentPage = async () => {
    const departments = await listDepartments(true);
    const parentOptions = departments.map((d) => ({ value: d.id, label: `${d.code} · ${d.name}` }));

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "HR", href: "/hr" },
                    { label: "Departments", href: "/hr/departments" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Departments · New"
                        title="New department"
                        description="Codes are short, stable identifiers — they don't change once people are assigned."
                    />
                    <NewDepartmentForm parentOptions={parentOptions} />
                </div>
            </div>
        </>
    );
};

export default NewDepartmentPage;
