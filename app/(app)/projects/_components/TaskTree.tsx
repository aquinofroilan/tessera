import Link from "next/link";
import { IconChevronRight, IconUser } from "@tabler/icons-react";

import { Card } from "@/components/ui";
import { TableEmptyState } from "../../hr/_components/TableEmptyState";
import type { ProjectTaskTreeNode } from "@/lib/api/projects/tasks";
import { TaskStatusBadge } from "./TaskStatusBadge";

type EmployeeInfo = { employeeNumber: string; firstName: string; lastName: string };

type Props = {
    projectId: string;
    nodes: ProjectTaskTreeNode[];
    employeeById: Record<string, EmployeeInfo>;
};

const TaskRow = ({
    node,
    depth,
    projectId,
    employeeById,
}: {
    node: ProjectTaskTreeNode;
    depth: number;
    projectId: string;
    employeeById: Record<string, EmployeeInfo>;
}) => {
    const assignee = node.assigneeEmployeeId
        ? employeeById[node.assigneeEmployeeId]
        : undefined;

    return (
        <>
            <div
                className="flex items-center gap-3 border-b border-(--rule) px-5 py-3 last:border-b-0 hover:bg-(--paper-2)"
                style={{ paddingLeft: `${20 + depth * 24}px` }}>
                {depth > 0 && (
                    <IconChevronRight stroke={1.8} className="size-3.5 text-(--muted)" />
                )}
                <Link
                    href={`/projects/${projectId}/tasks/${node.id}/edit`}
                    className="flex-1 truncate text-[14px] text-(--ink) hover:text-(--accent)">
                    {node.name}
                </Link>
                {assignee && (
                    <span className="inline-flex items-center gap-1 text-[12px] text-(--ink-soft)">
                        <IconUser stroke={1.8} className="size-3.5" />
                        {assignee.employeeNumber}
                    </span>
                )}
                <TaskStatusBadge status={node.status} />
            </div>
            {node.children.map((child) => (
                <TaskRow
                    key={child.id}
                    node={child}
                    depth={depth + 1}
                    projectId={projectId}
                    employeeById={employeeById}
                />
            ))}
        </>
    );
};

export const TaskTree = ({ projectId, nodes, employeeById }: Props) => {
    if (!nodes.length) {
        return (
            <TableEmptyState
                icon={IconChevronRight}
                title="No tasks yet."
                hint="Break the project down. Top-level tasks first; nest as the work clarifies."
            />
        );
    }

    return (
        <Card className="p-0">
            <div>
                {nodes.map((node) => (
                    <TaskRow
                        key={node.id}
                        node={node}
                        depth={0}
                        projectId={projectId}
                        employeeById={employeeById}
                    />
                ))}
            </div>
        </Card>
    );
};
