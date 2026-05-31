import type { Metadata } from "next";
import Link from "next/link";
import {
    IconAlertTriangle,
    IconArrowRight,
    IconArrowsTransferDown,
    IconBuildingWarehouse,
    IconScale,
} from "@tabler/icons-react";

import { Button, Card } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";

export const metadata: Metadata = {
    title: "Inventory reports · Tessera",
    description: "Stock on hand, valuation, movement history, low stock.",
};

type ReportTile = {
    href: string;
    title: string;
    description: string;
    icon: typeof IconBuildingWarehouse;
};

const REPORTS: ReportTile[] = [
    {
        href: "/inventory/reports/stock-on-hand",
        title: "Stock on hand",
        description: "Item × warehouse pivot of current quantities. Pick an as-of date for back-dated snapshots.",
        icon: IconBuildingWarehouse,
    },
    {
        href: "/inventory/reports/valuation",
        title: "Valuation",
        description: "Per-item carrying value. Reconciles to GL 1300 — variance flagged when non-zero.",
        icon: IconScale,
    },
    {
        href: "/inventory/reports/movements",
        title: "Movement history",
        description: "Filterable history with running totals per item. Picks up where the ledger leaves off.",
        icon: IconArrowsTransferDown,
    },
    {
        href: "/inventory/reports/low-stock",
        title: "Low stock",
        description: "Items at or below their reorder point — with a one-click bill draft to the primary vendor.",
        icon: IconAlertTriangle,
    },
];

const InventoryReportsPage = () => (
    <>
        <AppTopbar crumbs={[{ label: "Inventory", href: "/inventory" }, { label: "Reports" }]} />
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-400 p-9">
                <PageHeader
                    eyebrow="Inventory"
                    title={
                        <>
                            Reports<em className="text-(--accent) italic">.</em>
                        </>
                    }
                    description="Stock state, valuation, movement history, and reorder alerts. All reports read from the same ledger and reconcile against the journal."
                />

                <Block title="Available reports" description="Pick one to explore current and as-of-date views.">
                    <div className="grid gap-4">
                        {REPORTS.map(({ href, title, description, icon: Icon }) => (
                            <Card key={href} className="p-6">
                                <div className="flex items-start gap-5">
                                    <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--ink-soft)">
                                        <Icon className="size-5" stroke={1.6} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="font-display text-[15px] font-[420] tracking-[-0.01em] text-(--ink)">
                                            {title}
                                        </div>
                                        <div className="mt-1 text-[13px] text-(--muted)">{description}</div>
                                    </div>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={href}>
                                            Open
                                            <IconArrowRight stroke={1.8} />
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Block>
            </div>
        </div>
    </>
);

export default InventoryReportsPage;
