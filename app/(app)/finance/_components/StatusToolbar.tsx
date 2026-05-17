"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";

import { Button, IconInput } from "@/components/ui";
import { cn } from "@/lib/utils";

export type StatusToolbarTab<S extends string> = { value: S | "ALL"; label: string };

type StatusToolbarProps<S extends string> = {
    tabs: StatusToolbarTab<S>[];
    activeStatus: S | "ALL";
    initialQ: string;
    counts: Record<S | "ALL", number>;
    searchPlaceholder: string;
    searchAriaLabel: string;
    tabsAriaLabel?: string;
    paramKey?: string;
    clearValue?: S | "ALL";
};

export function StatusToolbar<S extends string>({
    tabs,
    activeStatus,
    initialQ,
    counts,
    searchPlaceholder,
    searchAriaLabel,
    tabsAriaLabel = "Filter by status",
    paramKey = "status",
    clearValue = "ALL",
}: StatusToolbarProps<S>) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [pending, startTransition] = useTransition();
    const [search, setSearch] = useState(initialQ);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearch(initialQ);
    }, [initialQ]);

    useEffect(() => {
        if (search === initialQ) return;
        const t = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (search) params.set("q", search);
            else params.delete("q");
            params.delete("page");
            const qs = params.toString();
            startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
        }, 250);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const setStatus = (next: S | "ALL") => {
        const params = new URLSearchParams(searchParams.toString());
        if (next === clearValue) params.delete(paramKey);
        else params.set(paramKey, next);
        params.delete("page");
        const qs = params.toString();
        startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    };

    return (
        <div
            className={cn(
                "flex flex-wrap items-center justify-between gap-4 transition-opacity",
                pending && "opacity-70",
            )}>
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={tabsAriaLabel}>
                {tabs.map((tab) => {
                    const active = tab.value === activeStatus;
                    return (
                        <Button
                            key={tab.value}
                            variant="chip"
                            size="sm"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setStatus(tab.value)}>
                            {tab.label}
                            <span
                                className={cn(
                                    "rounded-full px-1.5 font-mono text-[10px] tabular-nums",
                                    active ? "bg-(--paper)/15 text-(--paper)" : "bg-(--paper-2) text-(--muted)",
                                )}>
                                {counts[tab.value]}
                            </span>
                        </Button>
                    );
                })}
            </div>

            <IconInput
                tone="compact"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                startIcon={<IconSearch className="size-3.5" stroke={1.8} />}
                className="min-w-72"
                aria-label={searchAriaLabel}
            />
        </div>
    );
}
