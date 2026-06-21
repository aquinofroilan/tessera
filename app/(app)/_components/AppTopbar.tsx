import Link from "next/link";
import { Suspense } from "react";
import { IconBell, IconHelpCircle } from "@tabler/icons-react";
import { Button } from "@/components/ui";
import { CommandPaletteTrigger } from "./CommandPaletteTrigger";
import { NotificationBell } from "./NotificationBell";

export type Crumb = {
    label: string;
    href?: string;
};

export function AppTopbar({ crumbs }: { crumbs: Crumb[] }) {
    return (
        <header className="border-border flex h-14.5 shrink-0 items-center gap-5 border-b bg-(--paper)/85 px-7 backdrop-blur-[10px]">
            <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-(--muted) uppercase">
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

            <CommandPaletteTrigger />

            <Button variant="outline" size="sm">
                <IconHelpCircle stroke={1.8} />
                Docs
            </Button>

            <Suspense
                fallback={
                    <Button
                        asChild
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Notifications"
                        className="relative">
                        <Link href="/notifications">
                            <IconBell stroke={1.8} />
                        </Link>
                    </Button>
                }>
                <NotificationBell />
            </Suspense>
        </header>
    );
}
