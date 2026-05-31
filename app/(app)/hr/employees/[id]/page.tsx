import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { listDepartments } from "@/lib/api/hr/departments-dal";
import { getEmployee } from "@/lib/api/hr/employees-dal";
import { EmployeeStatusBadge } from "../../_components/EmployeeStatusBadge";
import { ProfileGrid, type ProfileRow } from "../../_components/ProfileGrid";
import { EditEmployeeForm } from "./_components/EditEmployeeForm";
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

    const departments = await listDepartments();
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
