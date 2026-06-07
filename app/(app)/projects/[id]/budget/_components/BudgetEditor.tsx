"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { IconDeviceFloppy } from "@tabler/icons-react";

import { Button, Card, Input, Label } from "@/components/ui";
import {
    PROJECT_COST_CATEGORIES,
    type ProjectBudgetResponse,
    type ProjectCostCategory,
} from "@/lib/api/projects/budgets";
import { setBudgetAction } from "../_data/set-budget-action";

const CATEGORY_LABEL: Record<ProjectCostCategory, string> = {
    LABOR: "Labor",
    MATERIAL: "Material",
    EXPENSE: "Expense",
    OTHER: "Other",
};

const CATEGORY_DESC: Record<ProjectCostCategory, string> = {
    LABOR: "People hours — feeds budget-vs-actual via approved billable time.",
    MATERIAL: "Stock, parts, supplies consumed by the project.",
    EXPENSE: "Travel, services, reimbursables.",
    OTHER: "Anything that doesn't fit above.",
};

type Props = {
    projectId: string;
    budgets: ProjectBudgetResponse[];
};

const BudgetRow = ({
    projectId,
    category,
    initial,
}: {
    projectId: string;
    category: ProjectCostCategory;
    initial: string;
}) => {
    const [value, setValue] = useState(initial);
    const [pending, startTransition] = useTransition();
    const dirty = value !== initial;

    const save = () => {
        startTransition(async () => {
            const result = await setBudgetAction(projectId, category, value);
            if (!result.ok) toast.error(result.error);
            else toast.success(`${CATEGORY_LABEL[category]} budget saved.`);
        });
    };

    return (
        <div className="flex items-end gap-4 border-b border-(--rule) px-6 py-4 last:border-b-0">
            <div className="flex-1">
                <div className="font-display text-[15px] font-[420] tracking-[-0.01em] text-(--ink)">
                    {CATEGORY_LABEL[category]}
                </div>
                <div className="mt-0.5 text-[12px] text-(--muted)">{CATEGORY_DESC[category]}</div>
            </div>
            <div className="w-40">
                <Label variant="eyebrow">Amount</Label>
                <Input
                    inputMode="decimal"
                    placeholder="0.00"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
            <Button variant="outline" size="sm" disabled={!dirty || pending} onClick={save}>
                <IconDeviceFloppy stroke={1.8} />
                Save
            </Button>
        </div>
    );
};

export const BudgetEditor = ({ projectId, budgets }: Props) => {
    const budgetByCategory: Partial<Record<ProjectCostCategory, string>> = Object.fromEntries(
        budgets.map((b) => [b.category, b.budgetAmount] as const),
    );

    return (
        <Card className="p-0">
            {PROJECT_COST_CATEGORIES.map((cat) => (
                <BudgetRow
                    key={cat}
                    projectId={projectId}
                    category={cat}
                    initial={budgetByCategory[cat] ?? ""}
                />
            ))}
        </Card>
    );
};
