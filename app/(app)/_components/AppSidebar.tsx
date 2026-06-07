"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    IconArrowsTransferDown,
    IconBook2,
    IconBeach,
    IconBriefcase2,
    IconBuilding,
    IconBuildingBank,
    IconBuildingWarehouse,
    IconCalendarOff,
    IconCash,
    IconChartPie,
    IconChecklist,
    IconChecks,
    IconClock,
    IconSelector,
    IconCoins,
    IconDots,
    IconFileInvoice,
    IconLayoutDashboard,
    IconPackage,
    IconReceipt2,
    IconReportAnalytics,
    IconRuler,
    IconSettings,
    IconUserCircle,
    IconUsers,
    type Icon,
} from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

type NavItem = {
    href: string;
    label: string;
    icon: Icon;
    badge?: string;
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
            { href: "/finance/ar/invoices", label: "Invoices", icon: IconFileInvoice, badge: "5" },
            { href: "/finance/ar/customers", label: "Customers", icon: IconUsers },
        ],
    },
    {
        label: "Payables",
        items: [
            { href: "/finance/ap/bills", label: "Bills", icon: IconReceipt2, badge: "2" },
            { href: "/finance/ap/vendors", label: "Vendors", icon: IconBuildingBank },
        ],
    },
    {
        label: "Inventory",
        items: [
            { href: "/inventory/items", label: "Items", icon: IconPackage },
            { href: "/inventory/warehouses", label: "Warehouses", icon: IconBuildingWarehouse },
            { href: "/inventory/movements", label: "Movements", icon: IconArrowsTransferDown },
            { href: "/inventory/reports", label: "Reports", icon: IconChartPie },
            { href: "/inventory/settings/uoms", label: "Units of measure", icon: IconRuler },
        ],
    },
    {
        label: "People",
        items: [
            { href: "/hr/me", label: "My profile", icon: IconUserCircle },
            { href: "/hr/employees", label: "Employees", icon: IconUsers },
            { href: "/hr/departments", label: "Departments", icon: IconBuilding },
            { href: "/hr/positions", label: "Positions", icon: IconBriefcase2 },
            { href: "/hr/leave-requests", label: "Leave requests", icon: IconCalendarOff },
            { href: "/hr/leave-types", label: "Leave types", icon: IconBeach },
            { href: "/hr/payroll-runs", label: "Payroll runs", icon: IconCash },
        ],
    },
    {
        label: "Projects",
        items: [
            { href: "/projects", label: "Projects", icon: IconChecklist },
            { href: "/projects/time", label: "Time entries", icon: IconClock },
            { href: "/projects/time/approvals", label: "Approvals", icon: IconChecks },
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
    {
        label: "Account",
        items: [{ href: "/finance/settings", label: "Settings", icon: IconSettings }],
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-62 shrink-0 flex-col border-r border-(--rule) bg-(--paper-2) p-3.5 md:flex">
            <Link
                href="/"
                className="font-display mb-1.5 inline-flex items-baseline gap-0.5 px-2.5 pt-2 pb-3.5 text-2xl font-medium tracking-[-0.02em] text-(--ink) italic">
                Tessera
                <span className="mb-1 ml-0.5 size-1.5 self-center rounded-full bg-(--accent)" />
            </Link>

            <Button variant="nav-card" size="nav-card" className="mb-4.5">
                <span className="font-display grid size-7 flex-none place-items-center rounded-md bg-(--accent) font-medium text-(--paper) italic">
                    H
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium tracking-[-0.005em] text-(--ink)">
                        Hollis &amp; Dray Millwork
                    </span>
                    <span className="block font-mono text-[11px] tracking-[0.03em] text-(--muted)">
                        ENTITY · FY2026
                    </span>
                </span>
                <IconSelector className="size-3.5 flex-none text-(--muted)" stroke={1.8} />
            </Button>

            <nav className="flex-1 overflow-y-auto">
                {groups.map((group) => (
                    <div key={group.label} className="mb-4.5">
                        <div className="px-2.5 pb-2 font-mono text-[10px] tracking-[0.14em] text-(--muted) uppercase">
                            {group.label}
                        </div>
                        <ul className="flex list-none flex-col gap-0.5">
                            {group.items.map((item) => {
                                const active =
                                    item.href === "/finance" ? pathname === "/finance" : pathname.startsWith(item.href);
                                const Icon = item.icon;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "group/nav flex items-center gap-2.75 rounded-lg px-2.5 py-2 text-[13.5px] tracking-[-0.003em] transition-colors",
                                                active
                                                    ? "bg-(--ink) font-medium text-(--paper)"
                                                    : "text-(--ink-soft) hover:bg-(--paper) hover:text-(--ink)",
                                            )}>
                                            <Icon
                                                className={cn(
                                                    "size-4.5 shrink-0",
                                                    active
                                                        ? "text-(--paper)"
                                                        : "text-(--muted) group-hover/nav:text-(--ink-soft)",
                                                )}
                                                stroke={1.6}
                                            />
                                            <span className="truncate">{item.label}</span>
                                            {item.badge && (
                                                <span
                                                    className={cn(
                                                        "ml-auto rounded-full px-1.5 py-px font-mono text-[10px] tracking-[0.02em]",
                                                        active
                                                            ? "bg-(--accent) text-(--paper)"
                                                            : "bg-(--rule) text-(--ink-soft)",
                                                    )}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <Button variant="nav-card" size="nav-card" className="mt-2">
                <span className="font-display grid size-8 flex-none place-items-center rounded-full bg-gradient-to-br from-(--plum) to-(--accent) text-[13px] font-medium text-(--paper) shadow-[inset_0_0_0_2px_rgb(255_255_255/20%)]">
                    EV
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-medium tracking-[-0.003em] text-(--ink)">Emma Voss</span>
                    <span className="block text-[11px] text-(--muted)">COO · Owner</span>
                </span>
                <IconDots className="size-4 flex-none text-(--muted)" />
            </Button>
        </aside>
    );
}
