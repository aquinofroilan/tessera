import type { ReactNode } from "react";

import { Card } from "@/components/ui";

export type ProfileRow = { label: string; value: ReactNode };

export const ProfileGrid = ({ rows }: { rows: ProfileRow[] }) => (
    <Card className="p-6">
        <dl className="grid gap-x-8 gap-y-4 md:grid-cols-2">
            {rows.map((row, i) => (
                <div key={i} className="flex flex-col gap-1">
                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">
                        {row.label}
                    </dt>
                    <dd className="text-[14px] text-(--ink)">{row.value}</dd>
                </div>
            ))}
        </dl>
    </Card>
);
