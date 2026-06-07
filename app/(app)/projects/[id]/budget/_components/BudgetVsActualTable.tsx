import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import type {
    ProjectBudgetVsActualResponse,
    ProjectCostCategory,
} from "@/lib/api/projects/budgets";

const LABEL: Record<ProjectCostCategory, string> = {
    LABOR: "Labor",
    MATERIAL: "Material",
    EXPENSE: "Expense",
    OTHER: "Other",
};

type Props = {
    data: ProjectBudgetVsActualResponse;
};

const isNegative = (v: string): boolean => Number(v) < 0;

export const BudgetVsActualTable = ({ data }: Props) => (
    <Card className="p-0">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Budgeted</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.lines.map((line) => (
                    <TableRow key={line.category}>
                        <TableCell className="text-(--ink)">{LABEL[line.category]}</TableCell>
                        <TableCell className="text-right font-mono text-[12px] tabular-nums">
                            {line.budgeted}
                        </TableCell>
                        <TableCell className="text-right font-mono text-[12px] tabular-nums">
                            {line.actual}
                        </TableCell>
                        <TableCell
                            className={`text-right font-mono text-[12px] tabular-nums ${
                                isNegative(line.remaining) ? "text-red-600" : "text-(--ink-soft)"
                            }`}>
                            {line.remaining}
                        </TableCell>
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell className="font-display font-medium text-(--ink)">Total</TableCell>
                    <TableCell className="text-right font-mono text-[12px] font-semibold tabular-nums">
                        {data.totalBudgeted}
                    </TableCell>
                    <TableCell className="text-right font-mono text-[12px] font-semibold tabular-nums">
                        {data.totalActual}
                    </TableCell>
                    <TableCell
                        className={`text-right font-mono text-[12px] font-semibold tabular-nums ${
                            isNegative(data.totalRemaining) ? "text-red-600" : "text-(--ink)"
                        }`}>
                        {data.totalRemaining}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </Card>
);
