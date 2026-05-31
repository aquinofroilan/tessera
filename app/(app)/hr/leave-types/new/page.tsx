import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { NewLeaveTypeForm } from "./_components/NewLeaveTypeForm";

export const metadata: Metadata = {
    title: "New leave type · Loom",
};

const NewLeaveTypePage = () => (
    <>
        <AppTopbar
            crumbs={[
                { label: "HR", href: "/hr" },
                { label: "Leave types", href: "/hr/leave-types" },
                { label: "New" },
            ]}
        />
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-400 p-9">
                <PageHeader
                    eyebrow="HR · Leave types · New"
                    title="New leave type"
                    description="Codes are short and stable. Default entitlement seeds the per-employee balance for the year."
                />
                <NewLeaveTypeForm />
            </div>
        </div>
    </>
);

export default NewLeaveTypePage;
