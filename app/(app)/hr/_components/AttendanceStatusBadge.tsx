import type { AttendanceStatus } from "@/lib/api/hr/attendance";

const TONES: Record<AttendanceStatus, string> = {
    PRESENT: "bg-(--moss) text-(--paper)",
    ABSENT: "bg-(--accent) text-(--paper)",
    ON_LEAVE: "bg-(--ochre) text-(--ink)",
};

const LABELS: Record<AttendanceStatus, string> = {
    PRESENT: "Present",
    ABSENT: "Absent",
    ON_LEAVE: "On leave",
};

export const AttendanceStatusBadge = ({ status }: { status: AttendanceStatus }) => (
    <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase ${TONES[status]}`}>
        {LABELS[status]}
    </span>
);
