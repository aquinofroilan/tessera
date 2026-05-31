import type { Metadata } from "next";
import Link from "next/link";
import { IconDownload, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { listItems } from "@/lib/api/inventory/items-dal";
import { ItemsTable } from "../_components/ItemsTable";
import { ItemsToolbar } from "../_components/ItemsToolbar";
import { countItemsByStatus, filterItems, parseItemsQuery } from "../_data/items-query";

export const metadata: Metadata = {
    title: "Items · Loom",
    description: "Product and SKU catalog. Track on-hand, valuation, and reorder thresholds.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ItemsListPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const query = parseItemsQuery(sp);
    const items = await listItems();
    const counts = countItemsByStatus(items);
    const filtered = filterItems(items, query);

    return (
        <>
            <AppTopbar crumbs={[{ label: "Inventory", href: "/inventory" }, { label: "Items" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Inventory"
                        title={
                            <>
                                Items<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="What you stock, sell, or service. On-hand quantity and valuation update from posted stock movements."
                        actions={
                            <>
                                <Button variant="outline" size="sm">
                                    <IconDownload stroke={1.8} />
                                    Export
                                </Button>
                                <Button asChild variant="default" size="sm">
                                    <Link href="/inventory/items/new">
                                        <IconPlus stroke={1.8} />
                                        New item
                                    </Link>
                                </Button>
                            </>
                        }
                    />

                    <Block
                        title="All items"
                        description={`${filtered.length} of ${items.length} items match your filters.`}>
                        <div className="mb-5">
                            <ItemsToolbar activeStatus={query.status} initialQ={query.q} counts={counts} />
                        </div>
                        <ItemsTable rows={filtered} detailHrefBase="/inventory/items" />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default ItemsListPage;
