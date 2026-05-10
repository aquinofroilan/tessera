"use client";

import { useTransition, type MouseEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import type { PageWindow } from "../_data/filter";

function buildPageList(page: number, pageCount: number): (number | "ellipsis")[] {
    if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
    const pages: (number | "ellipsis")[] = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(pageCount - 1, page + 1);
    if (start > 2) pages.push("ellipsis");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < pageCount - 1) pages.push("ellipsis");
    pages.push(pageCount);
    return pages;
}

export function PaginationFooter({ window }: { window: PageWindow }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [pending, startTransition] = useTransition();

    const buildHref = (next: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (next <= 1) params.delete("page");
        else params.set("page", String(next));
        const qs = params.toString();
        return qs ? `${pathname}?${qs}` : pathname;
    };

    const navigate = (event: MouseEvent<HTMLAnchorElement>, target: number) => {
        event.preventDefault();
        if (target < 1 || target > window.pageCount || target === window.page) return;
        startTransition(() => router.replace(buildHref(target), { scroll: false }));
    };

    const items = buildPageList(window.page, window.pageCount);
    const isFirst = window.page <= 1;
    const isLast = window.page >= window.pageCount;

    return (
        <div className={cn("mt-4 flex flex-wrap items-center justify-between gap-3", pending && "opacity-70")}>
            <span className="font-mono text-[11px] tracking-[0.04em] text-(--muted) tabular-nums">
                Showing {window.from}–{window.to} of {window.total}
            </span>
            <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href={buildHref(window.page - 1)}
                            aria-disabled={isFirst}
                            className={cn(isFirst && "pointer-events-none opacity-50")}
                            onClick={(e) => navigate(e, window.page - 1)}
                        />
                    </PaginationItem>
                    {items.map((it, i) =>
                        it === "ellipsis" ? (
                            <PaginationItem key={`e-${i}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={it}>
                                <PaginationLink
                                    href={buildHref(it)}
                                    isActive={it === window.page}
                                    onClick={(e) => navigate(e, it)}>
                                    {it}
                                </PaginationLink>
                            </PaginationItem>
                        ),
                    )}
                    <PaginationItem>
                        <PaginationNext
                            href={buildHref(window.page + 1)}
                            aria-disabled={isLast}
                            className={cn(isLast && "pointer-events-none opacity-50")}
                            onClick={(e) => navigate(e, window.page + 1)}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
