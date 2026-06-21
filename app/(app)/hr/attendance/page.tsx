import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { listAttendance } from "@/lib/api/hr/attendance-dal";
import { listEmployees } from "@/lib/api/hr/employees-dal";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { AttendanceTable } from "./_components/AttendanceTable";
import { QuickClockCard } from "./_components/QuickClockCard";

export const metadata: Metadata = {
    title: "Attendance · Tessera",
    description: "Daily attendance, clock-in/out, and timesheet review.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const parseStr = (raw: string | string[] | undefined): string | undefined =>
    Array.isArray(raw) ? raw[0] : raw;

const AttendancePage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const employeeId = parseStr(sp.employeeId);
    const from = parseStr(sp.from);
    const to = parseStr(sp.to);

    const [records, employees] = await Promise.all([
        listAttendance({ employeeId, from, to }),
        listEmployees({ status: "ACTIVE" }),
    ]);

    const employeeNameById = Object.fromEntries(
        employees.map((e) => [e.id, `${e.firstName} ${e.lastName}`]),
    );

    const ordered = [...records].sort((a, b) =>
        b.workDate === a.workDate
            ? (b.clockIn ?? "").localeCompare(a.clockIn ?? "")
            : b.workDate.localeCompare(a.workDate),
    );

    return (
        <>
            <AppTopbar crumbs={[{ label: "HR", href: "/hr" }, { label: "Attendance" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="HR · Attendance"
                        title={
                            <>
                                Attendance<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Who showed up, when. Clock in or out from here, or enter a correction."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/hr/attendance/new">
                                    <IconPlus stroke={1.8} />
                                    New record
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="Clock in / out"
                        description="Pick an employee and clock them in. Click 'Clock out' on the same person to close the day.">
                        <QuickClockCard
                            employees={employees.map((e) => ({
                                id: e.id,
                                name: `${e.firstName} ${e.lastName}`,
                            }))}
                        />
                    </Block>

                    <Block
                        title="Timesheet"
                        description={`${ordered.length} record${ordered.length === 1 ? "" : "s"} — newest first.`}>
                        <AttendanceTable
                            rows={ordered}
                            employeeNameById={employeeNameById}
                            detailHrefBase="/hr/attendance"
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default AttendancePage;
