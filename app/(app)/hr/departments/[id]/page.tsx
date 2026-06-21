import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { getDepartment, listDepartments } from "@/lib/api/hr/departments-dal";
import { listEmployees } from "@/lib/api/hr/employees-dal";
import { EditDepartmentForm } from "./_components/EditDepartmentForm";
import { DepartmentDeactivateButton } from "./_components/DepartmentDeactivateButton";
import { SetParentControl } from "./_components/SetParentControl";
import { EmployeesTable } from "../../_components/EmployeesTable";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const department = await getDepartment(id);
    return { title: department ? `${department.name} · Tessera` : "Department · Tessera" };
};

const DepartmentDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const department = await getDepartment(id);
    if (!department) notFound();

    const [members, allDepartments] = await Promise.all([
        listEmployees({ departmentId: id }),
        listDepartments(true),
    ]);
    const parentName = department.parentId
        ? (allDepartments.find((d) => d.id === department.parentId)?.name ?? null)
        : null;
    const parentOptions = allDepartments
        .filter((d) => d.id !== department.id)
        .map((d) => ({ id: d.id, code: d.code, name: d.name }));

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "HR", href: "/hr" },
                    { label: "Departments", href: "/hr/departments" },
                    { label: department.name },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Departments"
                        title={department.name}
                        description={
                            department.description ??
                            `${members.length} member${members.length === 1 ? "" : "s"} assigned.`
                        }
                        actions={
                            <DepartmentDeactivateButton
                                departmentId={department.id}
                                isActive={department.isActive}
                            />
                        }
                    />

                    <Block
                        title="Profile"
                        description="Code is immutable. Name and description can be updated freely.">
                        <Card className="p-6">
                            <EditDepartmentForm
                                id={department.id}
                                defaultValues={{
                                    name: department.name,
                                    description: department.description ?? "",
                                }}
                            />
                        </Card>
                    </Block>

                    <Block
                        title="Hierarchy"
                        description={
                            parentName
                                ? `Currently rolls up under ${parentName}.`
                                : "Currently a top-level department."
                        }>
                        <SetParentControl
                            id={department.id}
                            currentParentId={department.parentId}
                            options={parentOptions}
                        />
                    </Block>

                    <Block
                        title="Members"
                        description={`${members.length} employee${members.length === 1 ? "" : "s"} in this department.`}>
                        <EmployeesTable
                            rows={members}
                            departmentNameById={{ [department.id]: department.name }}
                            detailHrefBase="/hr/employees"
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default DepartmentDetailPage;
