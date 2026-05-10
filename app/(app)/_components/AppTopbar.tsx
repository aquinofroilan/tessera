import { IconBell, IconChevronDown, IconSearch } from "@tabler/icons-react";

export function AppTopbar() {
    return (
        <header className="border-border bg-(--paper)/80 sticky top-0 z-40 flex h-17 items-center justify-between border-b px-6 backdrop-blur-[10px]">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="hover:bg-(--paper-2)/60 flex items-center gap-2 rounded-md border border-(--rule) bg-(--card) px-3 py-1.5 text-sm text-(--ink-soft) transition-colors">
                    <span className="font-display text-(--ink) text-[15px] font-medium tracking-[-0.005em]">
                        Hollis &amp; Dray Millwork
                    </span>
                    <IconChevronDown className="size-3.5 text-(--muted)" />
                </button>

                <span className="hidden font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase md:inline">
                    Fiscal year 2026 · Q2 open
                </span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    aria-label="Search"
                    className="hover:bg-(--paper-2)/60 grid size-9 place-items-center rounded-md text-(--ink-soft) transition-colors">
                    <IconSearch className="size-4.5" stroke={1.6} />
                </button>
                <button
                    type="button"
                    aria-label="Notifications"
                    className="hover:bg-(--paper-2)/60 relative grid size-9 place-items-center rounded-md text-(--ink-soft) transition-colors">
                    <IconBell className="size-4.5" stroke={1.6} />
                    <span className="absolute top-2 right-2 size-1.5 rounded-full bg-(--accent)" />
                </button>
                <div className="ml-2 grid size-9 place-items-center rounded-full bg-gradient-to-br from-(--plum) to-(--accent) font-display text-sm font-medium text-(--paper) shadow-[inset_0_0_0_2px_rgb(255_255_255/20%)]">
                    EV
                </div>
            </div>
        </header>
    );
}
