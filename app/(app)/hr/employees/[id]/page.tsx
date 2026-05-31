import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { listCompensation } from "@/lib/api/hr/compensation-dal";
import { listDepartments } from "@/lib/api/hr/departments-dal";
import { getEmployee } from "@/lib/api/hr/employees-dal";
import { listLeaveTypes } from "@/lib/api/hr/leave-types-dal";
import { getLeaveBalance, listLeaveRequests } from "@/lib/api/hr/leave-requests-dal";
import { listPositions } from "@/lib/api/hr/positions-dal";
import { CompensationTable } from "../../_components/CompensationTable";
import { EmployeeStatusBadge } from "../../_components/EmployeeStatusBadge";
import { ProfileGrid, type ProfileRow } from "../../_components/ProfileGrid";
import { AddCompensationForm } from "./_components/AddCompensationForm";
import { EditEmployeeForm } from "./_components/EditEmployeeForm";
import { EmployeeLeaveBlock } from "./_components/EmployeeLeaveBlock";
import { LifecycleActions } from "./_components/LifecycleActions";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const employee = await getEmployee(id);
    return {
        title: employee ? `${employee.firstName} ${employee.lastName} · Loom` : "Employee · Loom",
    };
};

const EmployeeDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const employee = await getEmployee(id);
    if (!employee) notFound();

    const [departments, leaveTypes, employeeRequests, positions, compHistory] = await Promise.all([
        listDepartments(),
        listLeaveTypes(true),
        listLeaveRequests({ employeeId: id }),
        listPositions(true),
        listCompensation(id),
    ]);
    const sortedComp = [...compHistory].sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate));
    const todayStr = new Date().toISOString().slice(0, 10);
    const currentComp = sortedComp.find((c) => c.effectiveDate <= todayStr) ?? sortedComp[0] ?? null;
    const year = new Date().getUTCFullYear();
    const balances = await Promise.all(
        leaveTypes.map((t) =>
            getLeaveBalance(id, t.id, year).catch(() => ({
                employeeId: id,
                leaveTypeId: t.id,
                year,
                entitlementDays: t.defaultAnnualDays,
                usedDays: 0,
                remainingDays: t.defaultAnnualDays,
            })),
        ),
    );
    const recentRequests = [...employeeRequests]
        .sort((a, b) => (a.createdAt && b.createdAt ? b.createdAt.localeCompare(a.createdAt) : 0))
        .slice(0, 5);

    const departmentName = employee.departmentId
        ? (departments.find((d) => d.id === employee.departmentId)?.name ?? "—")
        : "Unassigned";

    const profile: ProfileRow[] = [
        { label: "Number", value: employee.employeeNumber },
        { label: "Email", value: employee.email ?? "—" },
        { label: "Job title", value: employee.jobTitle ?? "—" },
        { label: "Department", value: departmentName },
        { label: "Hired", value: employee.hireDate },
        { label: "Terminated", value: employee.terminationDate ?? "—" },
    ];

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "HR", href: "/hr" },
                    { label: "Employees", href: "/hr/employees" },
                    { label: `${employee.firstName} ${employee.lastName}` },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Employees"
                        title={`${employee.firstName} ${employee.lastName}`}
                        description={employee.jobTitle ?? `Hired ${employee.hireDate}.`}
                        actions={<EmployeeStatusBadge status={employee.status} />}
                    />

                    <Block title="Profile" description="Identity, contact, and placement.">
                        <ProfileGrid rows={profile} />
                    </Block>

                    <Block
                        title="Edit profile"
                        description="First name, last name, email, and job title. Hire date is immutable; reassign department below.">
                        <Card className="p-6">
                            <EditEmployeeForm
                                id={employee.id}
                                defaultValues={{
                                    firstName: employee.firstName,
                                    lastName: employee.lastName,
                                    email: employee.email ?? "",
                                    jobTitle: employee.jobTitle ?? "",
                                }}
                            />
                        </Card>
                    </Block>

                    <Block
                        title="Compensation"
                        description="Effective-dated history — append-only. The most recent record on or before today is current.">
                        <div className="grid gap-4">
                            <CompensationTable
                                rows={sortedComp}
                                positions={positions}
                                currentId={currentComp?.id ?? null}
                            />
                            <AddCompensationForm
                                employeeId={employee.id}
                                positions={positions.map((p) => ({
                                    id: p.id,
                                    code: p.code,
                                    title: p.title,
                                }))}
                            />
                        </div>
                    </Block>

                    <Block
                        title="Time off"
                        description="Balance by leave type for the current year, plus the most recent requests.">
                        <EmployeeLeaveBlock
                            employeeId={employee.id}
                            leaveTypes={leaveTypes}
                            balances={balances}
                            recentRequests={recentRequests}
                            year={year}
                        />
                    </Block>

                    <Block
                        title="Lifecycle"
                        description="Reassign department, mark as on leave, return to active, or terminate. Termination is permanent — corrections require a new hire record.">
                        <LifecycleActions
                            employeeId={employee.id}
                            status={employee.status}
                            currentDepartmentId={employee.departmentId}
                            departments={departments.map((d) => ({
                                id: d.id,
                                code: d.code,
                                name: d.name,
                            }))}
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default EmployeeDetailPage;
