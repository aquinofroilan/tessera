import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { listWarehouses } from "@/lib/api/inventory/warehouses-dal";
import { WarehousesTable } from "../_components/WarehousesTable";

export const metadata: Metadata = {
    title: "Warehouses · Loom",
    description: "Where stock lives. Manage warehouses, storage locations, and per-warehouse policies.",
};

const WarehousesListPage = async () => {
    const warehouses = await listWarehouses();

    return (
        <>
            <AppTopbar crumbs={[{ label: "Inventory", href: "/inventory" }, { label: "Warehouses" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Inventory"
                        title={
                            <>
                                Warehouses<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Where stock lives. Each warehouse has its own storage locations and policies — including whether negative stock is allowed."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/inventory/warehouses/new">
                                    <IconPlus stroke={1.8} />
                                    New warehouse
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="All warehouses"
                        description={`${warehouses.length} warehouse${warehouses.length === 1 ? "" : "s"}.`}>
                        <WarehousesTable rows={warehouses} detailHrefBase="/inventory/warehouses" />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default WarehousesListPage;
