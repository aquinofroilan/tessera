import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { listEmployees } from "@/lib/api/hr/employees-dal";
import { listProjects } from "@/lib/api/projects/projects-dal";
import { listTimeEntries } from "@/lib/api/projects/time-entries-dal";
import { TimeEntriesTable } from "../../_components/TimeEntriesTable";

export const metadata: Metadata = {
    title: "Approval queue · Tessera",
    description: "Submitted time entries awaiting approval.",
};

const ApprovalQueuePage = async () => {
    const [employees, projects, entries] = await Promise.all([
        listEmployees(),
        listProjects(),
        listTimeEntries({ status: "SUBMITTED" }),
    ]);

    const employeeById = Object.fromEntries(
        employees.map((e) => [
            e.id,
            { employeeNumber: e.employeeNumber, firstName: e.firstName, lastName: e.lastName },
        ]),
    );
    const projectById = Object.fromEntries(
        projects.map((p) => [p.id, { projectNumber: p.projectNumber, name: p.name }]),
    );

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Projects", href: "/projects" },
                    { label: "Time", href: "/projects/time" },
                    { label: "Approvals" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Projects · Time"
                        title={
                            <>
                                Approval queue<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Submitted entries waiting on a decision. Approval is the gate to billing — only approved billable lines roll into T&M invoices."
                    />

                    <Block
                        title="Submitted"
                        description={`${entries.length} entr${entries.length === 1 ? "y" : "ies"} awaiting review.`}>
                        <TimeEntriesTable
                            rows={entries}
                            employeeById={employeeById}
                            projectById={projectById}
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default ApprovalQueuePage;
