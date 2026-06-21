import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui";
import { getAttendance } from "@/lib/api/hr/attendance-dal";
import { getEmployee } from "@/lib/api/hr/employees-dal";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { AttendanceStatusBadge } from "../../_components/AttendanceStatusBadge";
import { ProfileGrid, type ProfileRow } from "../../_components/ProfileGrid";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const record = await getAttendance(id);
    return {
        title: record ? `Attendance ${record.workDate} · Tessera` : "Attendance · Tessera",
    };
};

const formatTime = (value: string | null): string => {
    if (!value) return "—";
    return value.slice(11, 16);
};

const formatHours = (minutes: number | null): string => {
    if (minutes == null) return "—";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

const AttendanceDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const record = await getAttendance(id);
    if (!record) notFound();

    const employee = await getEmployee(record.employeeId);
    const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : record.employeeId;

    const rows: ProfileRow[] = [
        { label: "Employee", value: <Link href={`/hr/employees/${record.employeeId}`}>{employeeName}</Link> },
        { label: "Work date", value: record.workDate },
        { label: "Clock-in", value: formatTime(record.clockIn) },
        { label: "Clock-out", value: formatTime(record.clockOut) },
        { label: "Worked", value: formatHours(record.workedMinutes) },
        { label: "Status", value: <AttendanceStatusBadge status={record.status} /> },
    ];

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "HR", href: "/hr" },
                    { label: "Attendance", href: "/hr/attendance" },
                    { label: record.workDate },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Attendance"
                        title={`${employeeName} · ${record.workDate}`}
                        description={record.notes ?? "No notes."}
                        actions={
                            <Button asChild variant="outline" size="sm">
                                <Link href="/hr/attendance">Back to timesheet</Link>
                            </Button>
                        }
                    />

                    <Block title="Record" description="What's on file for this day.">
                        <ProfileGrid rows={rows} />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default AttendanceDetailPage;
