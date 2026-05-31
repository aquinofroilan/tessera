import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { NewPayrollRunForm } from "./_components/NewPayrollRunForm";

export const metadata: Metadata = {
    title: "New payroll run · Tessera",
};

const NewPayrollRunPage = () => (
    <>
        <AppTopbar
            crumbs={[
                { label: "HR", href: "/hr" },
                { label: "Payroll runs", href: "/hr/payroll-runs" },
                { label: "New" },
            ]}
        />
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-400 p-9">
                <PageHeader
                    eyebrow="HR · Payroll runs · New"
                    title="New payroll run"
                    description="Snapshots active employees' current compensation into pay lines. Hourly comp and non-base-currency records are skipped in this cut. Approval and payment are separate steps."
                />
                <NewPayrollRunForm />
            </div>
        </div>
    </>
);

export default NewPayrollRunPage;
