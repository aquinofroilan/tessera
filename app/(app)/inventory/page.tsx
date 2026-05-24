import type { Metadata } from "next";
import Link from "next/link";
import {
    IconArrowRight,
    IconArrowsTransferDown,
    IconBuildingWarehouse,
    IconPackage,
} from "@tabler/icons-react";

import { Button, Card } from "@/components/ui";
import { AppTopbar } from "../_components/AppTopbar";
import { Block } from "../_components/Block";
import { PageHeader } from "../_components/PageHeader";

export const metadata: Metadata = {
    title: "Inventory · Loom",
    description: "Items, stock, and movements.",
};

const InventoryDashboardPage = () => (
    <>
        <AppTopbar crumbs={[{ label: "Inventory" }]} />
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-400 p-9">
                <PageHeader
                    eyebrow="Inventory"
                    title={
                        <>
                            Inventory<em className="text-(--accent) italic">.</em>
                        </>
                    }
                    description="Items and warehouses. More modules — movements, valuation, low-stock alerts, and reports — land in follow-up releases."
                />

                <Block title="Catalog & storage" description="Manage what you stock, sell, or service — and where it lives.">
                    <div className="grid gap-4">
                        <Card className="p-6">
                            <div className="flex items-start gap-5">
                                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--ink-soft)">
                                    <IconPackage className="size-5" stroke={1.6} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="font-display text-[15px] font-[420] tracking-[-0.01em] text-(--ink)">
                                        Items
                                    </div>
                                    <div className="mt-1 text-[13px] text-(--muted)">
                                        Product and SKU catalog. Track on-hand, valuation, and reorder thresholds.
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/inventory/items">
                                        Open
                                        <IconArrowRight stroke={1.8} />
                                    </Link>
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-start gap-5">
                                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--ink-soft)">
                                    <IconBuildingWarehouse className="size-5" stroke={1.6} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="font-display text-[15px] font-[420] tracking-[-0.01em] text-(--ink)">
                                        Warehouses
                                    </div>
                                    <div className="mt-1 text-[13px] text-(--muted)">
                                        Where stock lives. Bins, zones, and per-warehouse policies like negative-stock allowance.
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/inventory/warehouses">
                                        Open
                                        <IconArrowRight stroke={1.8} />
                                    </Link>
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-start gap-5">
                                <span className="grid size-10 place-items-center rounded-full bg-(--paper-2) text-(--ink-soft)">
                                    <IconArrowsTransferDown className="size-5" stroke={1.6} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="font-display text-[15px] font-[420] tracking-[-0.01em] text-(--ink)">
                                        Movements
                                    </div>
                                    <div className="mt-1 text-[13px] text-(--muted)">
                                        Immutable ledger of receipts, issues, transfers, and adjustments. Each post auto-records a journal entry.
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/inventory/movements">
                                        Open
                                        <IconArrowRight stroke={1.8} />
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    </div>
                </Block>
            </div>
        </div>
    </>
);

export default InventoryDashboardPage;
