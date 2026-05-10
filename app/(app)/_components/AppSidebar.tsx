"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    IconBook2,
    IconBuildingBank,
    IconChartPie,
    IconCoins,
    IconFileInvoice,
    IconLayoutDashboard,
    IconReceipt2,
    IconReportAnalytics,
    IconSettings,
    IconUsers,
    type Icon,
} from "@tabler/icons-react";

import { LoomLogo } from "@/components/atoms/loom-logo";
import { cn } from "@/lib/utils";

type NavItem = {
    href: string;
    label: string;
    icon: Icon;
};

type NavGroup = {
    label: string;
    items: NavItem[];
};

const groups: NavGroup[] = [
    {
        label: "Overview",
        items: [{ href: "/finance", label: "Dashboard", icon: IconLayoutDashboard }],
    },
    {
        label: "Receivables",
        items: [
            { href: "/finance/ar/invoices", label: "Invoices", icon: IconFileInvoice },
            { href: "/finance/ar/customers", label: "Customers", icon: IconUsers },
        ],
    },
    {
        label: "Payables",
        items: [
            { href: "/finance/ap/bills", label: "Bills", icon: IconReceipt2 },
            { href: "/finance/ap/vendors", label: "Vendors", icon: IconBuildingBank },
        ],
    },
    {
        label: "Ledger",
        items: [
            { href: "/finance/journal", label: "Journal", icon: IconBook2 },
            { href: "/finance/accounts", label: "Chart of accounts", icon: IconCoins },
        ],
    },
    {
        label: "Reports",
        items: [
            { href: "/finance/reports/income-statement", label: "Income statement", icon: IconReportAnalytics },
            { href: "/finance/reports/balance-sheet", label: "Balance sheet", icon: IconChartPie },
        ],
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <aside className="border-border bg-(--paper) hidden w-66 shrink-0 flex-col border-r md:flex">
            <div className="flex h-17 items-center px-6">
                <LoomLogo size="sm" />
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-6">
                {groups.map((group) => (
                    <div key={group.label} className="mb-5">
                        <div className="px-3 pb-2 font-mono text-[10px] tracking-[0.16em] text-(--muted) uppercase">
                            {group.label}
                        </div>
                        <ul className="flex list-none flex-col gap-0.5">
                            {group.items.map((item) => {
                                const active =
                                    item.href === "/finance"
                                        ? pathname === "/finance"
                                        : pathname.startsWith(item.href);
                                const Icon = item.icon;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                                                active
                                                    ? "bg-(--paper-2) font-medium text-(--ink)"
                                                    : "text-(--ink-soft) hover:bg-(--paper-2)/60 hover:text-(--ink)",
                                            )}>
                                            <Icon className="size-4 shrink-0" stroke={1.6} />
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="border-t border-(--rule-soft) px-3 py-3">
                <Link
                    href="/finance/settings"
                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-(--ink-soft) transition-colors hover:bg-(--paper-2)/60 hover:text-(--ink)">
                    <IconSettings className="size-4" stroke={1.6} />
                    Settings
                </Link>
            </div>
        </aside>
    );
}
