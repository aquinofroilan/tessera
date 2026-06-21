import type { Metadata } from "next";

import { listEmployees } from "@/lib/api/hr/employees-dal";
import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { NewAttendanceForm } from "./_components/NewAttendanceForm";

export const metadata: Metadata = {
    title: "New attendance record · Tessera",
};

const NewAttendancePage = async () => {
    const employees = await listEmployees({ status: "ACTIVE" });

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "HR", href: "/hr" },
                    { label: "Attendance", href: "/hr/attendance" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Attendance · New"
                        title="New attendance record"
                        description="Use this to enter a manual record or correct a missed clock-in/out."
                    />
                    <NewAttendanceForm
                        employees={employees.map((e) => ({
                            id: e.id,
                            name: `${e.firstName} ${e.lastName}`,
                        }))}
                    />
                </div>
            </div>
        </>
    );
};

export default NewAttendancePage;
