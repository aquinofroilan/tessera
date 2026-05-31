import type { Icon } from "@tabler/icons-react";

import { Card } from "@/components/ui";

type Props = {
    icon: Icon;
    title: string;
    hint: string;
};

export const TableEmptyState = ({ icon: IconComponent, title, hint }: Props) => (
    <Card className="items-center gap-3 px-6 py-12 text-center">
        <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--muted)">
            <IconComponent className="size-5" stroke={1.6} />
        </span>
        <div className="font-display text-foreground text-xl font-[380] tracking-[-0.01em]">
            {title}
        </div>
        <div className="max-w-80 text-sm text-(--muted)">{hint}</div>
    </Card>
);
