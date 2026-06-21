"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { IconAlertTriangle, IconFileInvoice } from "@tabler/icons-react";

import {
    Button,
    Card,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { NONE_SENTINEL } from "../../../hr/_data/select-sentinels";
import { generateProjectInvoiceAction } from "../_data/generate-invoice-action";

type Props = {
    projectId: string;
    customerName: string | null;
    defaultRevenueAccount: { code: string; name: string } | null;
    revenueAccountOptions: { id: string; code: string; name: string }[];
    billableCount: number;
    billableHours: string;
    billableAmount: string;
};

const fmt2 = (s: string) => (Number(s).toFixed ? Number(s).toFixed(2) : s);

export const GenerateInvoiceCard = ({
    projectId,
    customerName,
    defaultRevenueAccount,
    revenueAccountOptions,
    billableCount,
    billableHours,
    billableAmount,
}: Props) => {
    const [override, setOverride] = useState<string>(NONE_SENTINEL);
    const [pending, startTransition] = useTransition();

    const canGenerate = customerName !== null && billableCount > 0;
    const blockedReasons: string[] = [];
    if (!customerName) blockedReasons.push("Add a customer to the project before billing.");
    if (billableCount === 0)
        blockedReasons.push(
            "No billable lines yet. Approve billable time entries with a rate to make them billable.",
        );
    if (canGenerate && !defaultRevenueAccount && override === NONE_SENTINEL)
        blockedReasons.push(
            "The customer has no default revenue account. Pick one below or set a default on the customer.",
        );

    const overrideId = override === NONE_SENTINEL ? null : override;
    const fullyBlocked = !canGenerate;

    const handle = () => {
        startTransition(async () => {
            const result = await generateProjectInvoiceAction(projectId, overrideId);
            if (result && !result.ok) toast.error(result.error);
        });
    };

    return (
        <Card className="p-6">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <Label variant="eyebrow">Customer</Label>
                        <div className="mt-1 text-[14px] text-(--ink)">
                            {customerName ?? <span className="text-(--muted)">—</span>}
                        </div>
                    </div>
                    <div>
                        <Label variant="eyebrow">Default revenue account</Label>
                        <div className="mt-1 text-[14px] text-(--ink)">
                            {defaultRevenueAccount ? (
                                `${defaultRevenueAccount.code} · ${defaultRevenueAccount.name}`
                            ) : (
                                <span className="text-(--muted)">Not set</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <Label variant="eyebrow">Billable lines</Label>
                        <div className="mt-1 font-mono text-[14px] tabular-nums text-(--ink)">
                            {billableCount} · {fmt2(billableHours)} h · {fmt2(billableAmount)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-4">
                <div className="min-w-64 flex-1">
                    <Label variant="eyebrow">Revenue account (override)</Label>
                    <Select value={override} onValueChange={setOverride}>
                        <SelectTrigger>
                            <SelectValue placeholder="Use customer default" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={NONE_SENTINEL}>(use customer default)</SelectItem>
                            {revenueAccountOptions.map((opt) => (
                                <SelectItem key={opt.id} value={opt.id}>
                                    {opt.code} · {opt.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    variant="default"
                    size="sm"
                    disabled={fullyBlocked || pending}
                    onClick={handle}>
                    <IconFileInvoice stroke={1.8} />
                    Generate invoice
                </Button>
            </div>

            {blockedReasons.length > 0 && (
                <div className="mt-5 grid gap-2 rounded-lg border border-(--rule) bg-(--paper-2) p-4">
                    {blockedReasons.map((reason) => (
                        <div
                            key={reason}
                            className="flex items-start gap-2 text-[13px] text-(--ink-soft)">
                            <IconAlertTriangle
                                stroke={1.8}
                                className="mt-0.5 size-4 text-(--muted)"
                            />
                            <span>{reason}</span>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};
