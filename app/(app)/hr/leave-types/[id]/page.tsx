import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { getLeaveType } from "@/lib/api/hr/leave-types-dal";
import { EditLeaveTypeForm } from "./_components/EditLeaveTypeForm";
import { LeaveTypeDeactivateButton } from "./_components/LeaveTypeDeactivateButton";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const type = await getLeaveType(id);
    return { title: type ? `${type.name} · Tessera` : "Leave type · Tessera" };
};

const LeaveTypeDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const type = await getLeaveType(id);
    if (!type) notFound();

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "HR", href: "/hr" },
                    { label: "Leave types", href: "/hr/leave-types" },
                    { label: type.name },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Leave types"
                        title={type.name}
                        description={`${type.paid ? "Paid" : "Unpaid"} · ${type.defaultAnnualDays} default day${type.defaultAnnualDays === 1 ? "" : "s"}.`}
                        actions={<LeaveTypeDeactivateButton id={type.id} isActive={type.isActive} />}
                    />

                    <Block
                        title="Profile"
                        description="Code is immutable once set. Name, paid flag, and default entitlement can be updated freely.">
                        <Card className="p-6">
                            <EditLeaveTypeForm
                                id={type.id}
                                defaultValues={{
                                    name: type.name,
                                    paid: type.paid,
                                    defaultAnnualDays: type.defaultAnnualDays,
                                }}
                            />
                        </Card>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default LeaveTypeDetailPage;
