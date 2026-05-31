import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { listEmployees } from "@/lib/api/hr/employees-dal";
import { listLeaveTypes } from "@/lib/api/hr/leave-types-dal";
import { NewLeaveRequestForm } from "./_components/NewLeaveRequestForm";

export const metadata: Metadata = {
    title: "New leave request · Loom",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const NewLeaveRequestPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const employeeId = (Array.isArray(sp.employeeId) ? sp.employeeId[0] : sp.employeeId) ?? "";

    const [employees, types] = await Promise.all([
        listEmployees({ status: "ACTIVE" }),
        listLeaveTypes(true),
    ]);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "HR", href: "/hr" },
                    { label: "Leave requests", href: "/hr/leave-requests" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Leave requests · New"
                        title="New leave request"
                        description="File on behalf of an employee. Day count is inclusive — start and end both consume balance. Approval is a separate step."
                    />
                    <NewLeaveRequestForm
                        initialEmployeeId={employeeId}
                        employees={employees.map((e) => ({
                            id: e.id,
                            label: `${e.employeeNumber} · ${e.firstName} ${e.lastName}`,
                        }))}
                        leaveTypes={types.map((t) => ({ id: t.id, label: `${t.code} · ${t.name}` }))}
                    />
                </div>
            </div>
        </>
    );
};

export default NewLeaveRequestPage;
