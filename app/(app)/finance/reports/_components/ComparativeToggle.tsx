"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export function ComparativeToggle({ active }: { active: boolean }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [pending, startTransition] = useTransition();

    const setActive = (next: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        if (next) params.set("compare", "1");
        else params.delete("compare");
        const qs = params.toString();
        startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    };

    return (
        <div
            className={cn("inline-flex gap-1.5", pending && "opacity-70")}
            role="tablist"
            aria-label="Comparative period">
            <Button variant="chip" size="sm" role="tab" aria-selected={!active} onClick={() => setActive(false)}>
                Current
            </Button>
            <Button variant="chip" size="sm" role="tab" aria-selected={active} onClick={() => setActive(true)}>
                With comparative
            </Button>
        </div>
    );
}
