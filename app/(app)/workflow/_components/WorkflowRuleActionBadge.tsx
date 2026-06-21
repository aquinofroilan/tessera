import { IconUserCircle, IconUsersGroup } from "@tabler/icons-react";

import type { WorkflowRuleActionType } from "@/lib/api/workflow-rules";

const ICONS: Record<WorkflowRuleActionType, typeof IconUserCircle> = {
    NOTIFY_USER: IconUserCircle,
    NOTIFY_ROLE: IconUsersGroup,
};

const LABELS: Record<WorkflowRuleActionType, string> = {
    NOTIFY_USER: "Notify user",
    NOTIFY_ROLE: "Notify role",
};

export const WorkflowRuleActionBadge = ({ type }: { type: WorkflowRuleActionType }) => {
    const Icon = ICONS[type];
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-(--paper-2) px-2 py-0.5 font-mono text-[10px] tracking-[0.06em] text-(--ink-soft) uppercase">
            <Icon className="size-3" stroke={1.6} />
            {LABELS[type]}
        </span>
    );
};
