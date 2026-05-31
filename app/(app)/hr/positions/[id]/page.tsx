import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { listDepartments } from "@/lib/api/hr/departments-dal";
import { getPosition } from "@/lib/api/hr/positions-dal";
import { EditPositionForm } from "./_components/EditPositionForm";
import { PositionDeactivateButton } from "./_components/PositionDeactivateButton";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const position = await getPosition(id);
    return { title: position ? `${position.title} · Tessera` : "Position · Tessera" };
};

const PositionDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const position = await getPosition(id);
    if (!position) notFound();

    const departments = await listDepartments();
    const departmentName = position.departmentId
        ? (departments.find((d) => d.id === position.departmentId)?.name ?? "—")
        : "Unassigned";

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "HR", href: "/hr" },
                    { label: "Positions", href: "/hr/positions" },
                    { label: position.title },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Positions"
                        title={position.title}
                        description={`${position.code} · ${departmentName}${position.payGrade ? ` · ${position.payGrade}` : ""}`}
                        actions={
                            <PositionDeactivateButton id={position.id} isActive={position.isActive} />
                        }
                    />

                    <Block
                        title="Profile"
                        description="Code is immutable. Title, department, and pay grade can be updated freely.">
                        <Card className="p-6">
                            <EditPositionForm
                                id={position.id}
                                defaultValues={{
                                    title: position.title,
                                    departmentId: position.departmentId ?? "",
                                    payGrade: position.payGrade ?? "",
                                }}
                                departments={departments.map((d) => ({
                                    id: d.id,
                                    code: d.code,
                                    name: d.name,
                                }))}
                            />
                        </Card>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default PositionDetailPage;
