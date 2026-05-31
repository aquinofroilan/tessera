"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    IconBook2,
    IconBoxSeam,
    IconBuildingBank,
    IconBuildingWarehouse,
    IconChartPie,
    IconCoins,
    IconFileInvoice,
    IconHistory,
    IconLayoutDashboard,
    IconPackage,
    IconPlus,
    IconReceipt2,
    IconReportAnalytics,
    IconRuler2,
    IconSearch,
    IconSettings,
    IconTransfer,
    IconTrendingDown,
    IconUsers,
    type Icon,
} from "@tabler/icons-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";

type PaletteItem = {
    id: string;
    label: string;
    href: string;
    keywords?: string;
    icon: Icon;
    group: "navigate" | "create";
    section: string;
};

const items: PaletteItem[] = [
    { id: "nav-dashboard", group: "navigate", section: "Overview", label: "Dashboard", href: "/finance", icon: IconLayoutDashboard, keywords: "home" },

    { id: "nav-invoices", group: "navigate", section: "Receivables", label: "Invoices", href: "/finance/ar/invoices", icon: IconFileInvoice, keywords: "ar receivables" },
    { id: "nav-customers", group: "navigate", section: "Receivables", label: "Customers", href: "/finance/ar/customers", icon: IconUsers, keywords: "ar parties" },

    { id: "nav-bills", group: "navigate", section: "Payables", label: "Bills", href: "/finance/ap/bills", icon: IconReceipt2, keywords: "ap payables" },
    { id: "nav-vendors", group: "navigate", section: "Payables", label: "Vendors", href: "/finance/ap/vendors", icon: IconBuildingBank, keywords: "ap suppliers parties" },

    { id: "nav-journal", group: "navigate", section: "Ledger", label: "Journal", href: "/finance/journal", icon: IconBook2, keywords: "entries gl" },
    { id: "nav-accounts", group: "navigate", section: "Ledger", label: "Chart of accounts", href: "/finance/accounts", icon: IconCoins, keywords: "coa gl" },

    { id: "nav-income", group: "navigate", section: "Reports", label: "Income statement", href: "/finance/reports/income-statement", icon: IconReportAnalytics, keywords: "p&l pnl profit loss" },
    { id: "nav-balance", group: "navigate", section: "Reports", label: "Balance sheet", href: "/finance/reports/balance-sheet", icon: IconChartPie },

    { id: "nav-inventory", group: "navigate", section: "Inventory", label: "Inventory overview", href: "/inventory", icon: IconBoxSeam },
    { id: "nav-items", group: "navigate", section: "Inventory", label: "Items", href: "/inventory/items", icon: IconPackage, keywords: "products skus" },
    { id: "nav-warehouses", group: "navigate", section: "Inventory", label: "Warehouses", href: "/inventory/warehouses", icon: IconBuildingWarehouse, keywords: "locations" },
    { id: "nav-movements", group: "navigate", section: "Inventory", label: "Stock movements", href: "/inventory/movements", icon: IconTransfer, keywords: "ledger receipts issues transfers" },
    { id: "nav-soh", group: "navigate", section: "Inventory", label: "Stock on hand", href: "/inventory/reports/stock-on-hand", icon: IconReportAnalytics },
    { id: "nav-valuation", group: "navigate", section: "Inventory", label: "Stock valuation", href: "/inventory/reports/valuation", icon: IconCoins, keywords: "wac fifo" },
    { id: "nav-mvts-report", group: "navigate", section: "Inventory", label: "Movements report", href: "/inventory/reports/movements", icon: IconHistory },
    { id: "nav-low-stock", group: "navigate", section: "Inventory", label: "Low-stock & reorder", href: "/inventory/reports/low-stock", icon: IconTrendingDown, keywords: "alerts reorder rules" },
    { id: "nav-uoms", group: "navigate", section: "Inventory", label: "Units of measure", href: "/inventory/settings/uoms", icon: IconRuler2, keywords: "uom" },

    { id: "nav-settings", group: "navigate", section: "Account", label: "Settings", href: "/finance/settings", icon: IconSettings },

    { id: "new-invoice", group: "create", section: "Receivables", label: "New invoice", href: "/finance/ar/invoices/new", icon: IconPlus },
    { id: "new-customer", group: "create", section: "Receivables", label: "New customer", href: "/finance/ar/customers/new", icon: IconPlus },
    { id: "new-bill", group: "create", section: "Payables", label: "New bill", href: "/finance/ap/bills/new", icon: IconPlus },
    { id: "new-vendor", group: "create", section: "Payables", label: "New vendor", href: "/finance/ap/vendors/new", icon: IconPlus },
    { id: "new-journal", group: "create", section: "Ledger", label: "New journal entry", href: "/finance/journal/new", icon: IconPlus },
    { id: "new-account", group: "create", section: "Ledger", label: "New account", href: "/finance/accounts/new", icon: IconPlus },
    { id: "new-item", group: "create", section: "Inventory", label: "New item", href: "/inventory/items/new", icon: IconPlus },
    { id: "new-warehouse", group: "create", section: "Inventory", label: "New warehouse", href: "/inventory/warehouses/new", icon: IconPlus },
    { id: "new-movement", group: "create", section: "Inventory", label: "New stock movement", href: "/inventory/movements/new", icon: IconPlus },
];

const navigateItems = items.filter((item) => item.group === "navigate");
const createItems = items.filter((item) => item.group === "create");
const itemById = new Map(items.map((item) => [item.id, item]));

const RECENTS_KEY = "loom:command-palette:recents";
const MAX_RECENTS = 5;

const readRecents = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem(RECENTS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as unknown;
        return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
    } catch {
        return [];
    }
};

const writeRecents = (ids: string[]) => {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(RECENTS_KEY, JSON.stringify(ids));
    } catch {
        // localStorage may be unavailable (privacy mode); fail silently
    }
};

export const CommandPaletteTrigger = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [recents, setRecents] = useState<string[]>([]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate client-only localStorage value after mount
        setRecents(readRecents());
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const run = useCallback(
        (item: PaletteItem) => {
            const next = [item.id, ...recents.filter((id) => id !== item.id)].slice(0, MAX_RECENTS);
            setRecents(next);
            writeRecents(next);
            setOpen(false);
            router.push(item.href);
        },
        [recents, router],
    );

    const recentItems = recents.map((id) => itemById.get(id)).filter((v): v is PaletteItem => v !== undefined);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex min-w-70 items-center gap-2 rounded-lg border border-(--rule) bg-(--paper-2) px-3 py-1.75 text-sm text-(--muted) transition-colors hover:border-(--muted-2)">
                <IconSearch className="size-3.5" stroke={1.8} />
                <span>Search…</span>
                <span className="ml-auto rounded border border-(--rule) bg-(--paper) px-1.25 py-px font-mono text-[10px] tracking-[0.04em] text-(--muted)">
                    ⌘K
                </span>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search routes and actions…" />
                <CommandList>
                    <CommandEmpty>No matches.</CommandEmpty>

                    {recentItems.length > 0 && (
                        <>
                            <CommandGroup heading="Recent">
                                {recentItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <CommandItem
                                            key={`recent-${item.id}`}
                                            value={`recent ${item.label} ${item.section} ${item.keywords ?? ""}`}
                                            onSelect={() => run(item)}>
                                            <Icon stroke={1.8} />
                                            <span>{item.label}</span>
                                            <span className="ml-auto text-[11px] text-(--muted)">{item.section}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                            <CommandSeparator />
                        </>
                    )}

                    <CommandGroup heading="Navigate">
                        {navigateItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <CommandItem
                                    key={item.id}
                                    value={`${item.label} ${item.section} ${item.keywords ?? ""}`}
                                    onSelect={() => run(item)}>
                                    <Icon stroke={1.8} />
                                    <span>{item.label}</span>
                                    <span className="ml-auto text-[11px] text-(--muted)">{item.section}</span>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Create">
                        {createItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <CommandItem
                                    key={item.id}
                                    value={`${item.label} ${item.section} ${item.keywords ?? ""}`}
                                    onSelect={() => run(item)}>
                                    <Icon stroke={1.8} />
                                    <span>{item.label}</span>
                                    <span className="ml-auto text-[11px] text-(--muted)">{item.section}</span>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
};
