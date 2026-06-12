import Link from "next/link";
import { IconRobot } from "@tabler/icons-react";

import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { KNOWN_NOTIFICATION_KINDS } from "@/lib/api/notification-preferences";
import type { WorkflowRuleResponse } from "@/lib/api/workflow-rules";
import { WorkflowRuleActionBadge } from "../../_components/WorkflowRuleActionBadge";

type Props = {
    rows: WorkflowRuleResponse[];
    detailHrefBase: string;
};

const KIND_LABELS = new Map(KNOWN_NOTIFICATION_KINDS.map((k) => [k.kind, k.label] as const));

export function WorkflowRulesTable({ rows, detailHrefBase }: Props) {
    if (!rows.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
                    <IconRobot className="size-5" stroke={1.6} />
                </span>
                <div className="font-display text-foreground text-xl font-[380]">No workflow rules yet.</div>
                <div className="max-w-80 text-sm text-(--muted)">
                    Create a rule to route domain events to the people who care.
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Rule</TableHead>
                        <TableHead className="w-[200px]">When</TableHead>
                        <TableHead className="w-[150px]">Action</TableHead>
                        <TableHead className="w-[180px]">Target</TableHead>
                        <TableHead className="w-[90px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((rule) => (
                        <TableRow key={rule.id}>
                            <TableCell>
                                <Link
                                    href={`${detailHrefBase}/${rule.id}`}
                                    className="text-foreground hover:text-(--accent) no-underline">
                                    <div className="grid gap-0.5">
                                        <span className="text-foreground text-[14px] font-medium">{rule.name}</span>
                                        {rule.description && (
                                            <span className="text-(--muted) text-[12px]">{rule.description}</span>
                                        )}
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell>
                                <div className="grid gap-0.5">
                                    <span className="text-[13px] text-(--ink-soft)">
                                        {KIND_LABELS.get(rule.eventKind) ?? rule.eventKind}
                                    </span>
                                    <span className="font-mono text-[10px] tracking-[0.04em] text-(--muted) uppercase">
                                        {rule.eventKind}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <WorkflowRuleActionBadge type={rule.actionType} />
                            </TableCell>
                            <TableCell className="font-mono text-[12px] text-(--ink-soft)">
                                {rule.actionTarget}
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] uppercase ${
                                        rule.enabled
                                            ? "bg-(--moss) text-(--paper)"
                                            : "bg-(--paper-3) text-(--muted)"
                                    }`}>
                                    {rule.enabled ? "Enabled" : "Disabled"}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
