import Link from "next/link";
import { IconBell, IconHelpCircle, IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui";

export type Crumb = {
    label: string;
    href?: string;
};

export function AppTopbar({ crumbs }: { crumbs: Crumb[] }) {
    return (
        <header className="border-border bg-(--paper)/85 sticky top-0 z-40 flex h-14.5 items-center gap-5 border-b px-7 backdrop-blur-[10px]">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-(--muted) uppercase">
                {crumbs.map((crumb, i) => {
                    const isLast = i === crumbs.length - 1;
                    return (
                        <span key={`${crumb.label}-${i}`} className="flex items-center gap-2">
                            {i > 0 && <span className="text-(--muted-2)">/</span>}
                            {isLast || !crumb.href ? (
                                <span className="font-medium text-(--ink)">{crumb.label}</span>
                            ) : (
                                <Link href={crumb.href} className="transition-colors hover:text-(--accent)">
                                    {crumb.label}
                                </Link>
                            )}
                        </span>
                    );
                })}
            </nav>

            <div className="flex-1" />

            <button
                type="button"
                className="hover:border-(--muted-2) flex min-w-70 items-center gap-2 rounded-lg border border-(--rule) bg-(--paper-2) px-3 py-1.75 text-sm text-(--muted) transition-colors">
                <IconSearch className="size-3.5" stroke={1.8} />
                <span>Search…</span>
                <span className="ml-auto rounded border border-(--rule) bg-(--paper) px-1.25 py-px font-mono text-[10px] tracking-[0.04em] text-(--muted)">
                    ⌘K
                </span>
            </button>

            <Button variant="outline" size="sm">
                <IconHelpCircle stroke={1.8} />
                Docs
            </Button>

            <Button variant="ghost" size="icon-sm" aria-label="Notifications" className="relative">
                <IconBell stroke={1.8} />
                <span className="absolute top-1.25 right-1.25 size-1.75 rounded-full border-2 border-(--paper) bg-(--accent)" />
            </Button>
        </header>
    );
}
