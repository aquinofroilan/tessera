import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { listDepartments } from "@/lib/api/hr/departments-dal";
import { NewPositionForm } from "./_components/NewPositionForm";

export const metadata: Metadata = {
    title: "New position · Tessera",
};

const NewPositionPage = async () => {
    const departments = await listDepartments(true);
    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "HR", href: "/hr" },
                    { label: "Positions", href: "/hr/positions" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Positions · New"
                        title="New position"
                        description="Codes are short and stable. Department and pay grade are optional and can be updated later."
                    />
                    <NewPositionForm
                        departments={departments.map((d) => ({ id: d.id, code: d.code, name: d.name }))}
                    />
                </div>
            </div>
        </>
    );
};

export default NewPositionPage;
