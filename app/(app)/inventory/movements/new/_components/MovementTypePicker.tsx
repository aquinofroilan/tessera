"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { MovementType } from "@/lib/api/inventory/movements";

const TYPES: { value: MovementType; label: string }[] = [
    { value: "RECEIPT", label: "Receipt" },
    { value: "ISSUE", label: "Issue" },
    { value: "TRANSFER", label: "Transfer" },
    { value: "ADJUSTMENT_IN", label: "Adjustment +" },
    { value: "ADJUSTMENT_OUT", label: "Adjustment −" },
];

export const MovementTypePicker = ({ active }: { active: MovementType }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const buildHref = (type: MovementType): string => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("type", type);
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="mb-6 flex flex-wrap gap-1.5" role="tablist" aria-label="Movement type">
            {TYPES.map((t) => {
                const isActive = t.value === active;
                return (
                    <Button
                        key={t.value}
                        asChild
                        variant="chip"
                        size="sm"
                        role="tab"
                        aria-selected={isActive}
                        className={cn(isActive && "bg-(--ink) text-(--paper)")}>
                        <Link href={buildHref(t.value)} scroll={false}>
                            {t.label}
                        </Link>
                    </Button>
                );
            })}
        </div>
    );
};
