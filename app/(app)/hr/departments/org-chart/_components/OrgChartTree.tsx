import Link from "next/link";
import { IconChevronDown, IconCornerDownRight } from "@tabler/icons-react";

import { Card } from "@/components/ui";
import type { DepartmentTreeNode } from "@/lib/api/hr/departments";

type Props = {
    nodes: DepartmentTreeNode[];
};

const Node = ({ node, depth }: { node: DepartmentTreeNode; depth: number }) => (
    <div className="grid gap-1.5">
        <Link
            href={`/hr/departments/${node.id}`}
            className={`group flex items-center gap-3 rounded-md px-3 py-2 no-underline transition-colors ${
                node.isActive
                    ? "bg-(--paper-2) text-foreground hover:bg-(--paper-3)"
                    : "bg-(--paper-2) text-(--muted) hover:bg-(--paper-3)"
            }`}>
            {depth > 0 ? (
                <IconCornerDownRight className="size-4 text-(--muted)" stroke={1.6} />
            ) : (
                <IconChevronDown className="size-4 text-(--accent)" stroke={1.6} />
            )}
            <div className="grid flex-1 gap-0.5">
                <div className="flex items-baseline gap-2">
                    <span className="text-foreground text-[14px] font-medium group-hover:text-(--accent)">
                        {node.name}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.04em] text-(--ink-soft) uppercase">
                        {node.code}
                    </span>
                </div>
                {!node.isActive && (
                    <span className="font-mono text-[10px] tracking-[0.08em] text-(--muted) uppercase">
                        Inactive
                    </span>
                )}
            </div>
        </Link>
        {node.children.length > 0 && (
            <div className="ml-5 grid gap-1.5 border-l border-(--rule) pl-3">
                {node.children.map((child) => (
                    <Node key={child.id} node={child} depth={depth + 1} />
                ))}
            </div>
        )}
    </div>
);

export const OrgChartTree = ({ nodes }: Props) => {
    if (!nodes.length) {
        return (
            <Card className="items-center gap-3 px-6 py-12 text-center">
                <div className="font-display text-foreground text-xl font-[380]">No departments yet.</div>
                <p className="max-w-80 text-sm text-(--muted)">
                    Create a department to start building the org chart.
                </p>
            </Card>
        );
    }

    return (
        <Card className="grid gap-3 p-5">
            {nodes.map((node) => (
                <Node key={node.id} node={node} depth={0} />
            ))}
        </Card>
    );
};
