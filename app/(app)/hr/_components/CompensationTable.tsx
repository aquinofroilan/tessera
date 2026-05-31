import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type { EmployeeCompensationResponse } from "@/lib/api/hr/compensation";
import type { PositionResponse } from "@/lib/api/hr/positions";

type Props = {
    rows: EmployeeCompensationResponse[];
    positions: PositionResponse[];
    currentId: string | null;
};

const PERIOD_LABEL: Record<EmployeeCompensationResponse["payPeriod"], string> = {
    ANNUAL: "Annual",
    MONTHLY: "Monthly",
    HOURLY: "Hourly",
};

export const CompensationTable = ({ rows, positions, currentId }: Props) => {
    const positionTitleById = Object.fromEntries(positions.map((p) => [p.id, p.title]));

    if (!rows.length) {
        return (
            <Card className="px-6 py-12 text-center text-[13px] text-(--muted)">
                No compensation records yet. Add the first one below.
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[140px]">Effective</TableHead>
                        <TableHead className="text-right">Pay rate</TableHead>
                        <TableHead className="w-[90px]">Currency</TableHead>
                        <TableHead className="w-[110px]">Period</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead className="w-[90px]">Current</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft) tabular-nums">
                                {row.effectiveDate}
                            </TableCell>
                            <TableCell className="text-right font-mono text-[13px] text-(--ink) tabular-nums">
                                {row.payRate}
                            </TableCell>
                            <TableCell className="font-mono text-[12px] tracking-[0.02em] text-(--ink-soft)">
                                {row.currency}
                            </TableCell>
                            <TableCell className="text-(--ink-soft)">{PERIOD_LABEL[row.payPeriod]}</TableCell>
                            <TableCell className="text-(--ink-soft)">
                                {row.positionId ? (positionTitleById[row.positionId] ?? "—") : "—"}
                            </TableCell>
                            <TableCell>
                                {row.id === currentId ? (
                                    <span className="inline-flex items-center rounded-full bg-(--accent)/15 px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-(--accent) uppercase">
                                        Current
                                    </span>
                                ) : (
                                    <span className="text-(--muted)">—</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
