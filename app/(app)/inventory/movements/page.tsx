import type { Metadata } from "next";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui";
import { AppTopbar } from "../../_components/AppTopbar";
import { Block } from "../../_components/Block";
import { PageHeader } from "../../_components/PageHeader";
import { listMovements } from "@/lib/api/inventory/movements-dal";
import { MovementsTable } from "../_components/MovementsTable";
import { MovementsToolbar } from "../_components/MovementsToolbar";
import { countMovementsByType, parseMovementsQuery } from "../_data/movements-query";

export const metadata: Metadata = {
    title: "Stock movements · Loom",
    description: "Immutable ledger of receipts, issues, transfers, and adjustments.",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const MovementsListPage = async ({ searchParams }: Props) => {
    const sp = await searchParams;
    const query = parseMovementsQuery(sp);
    const movements = await listMovements(
        query.type === "ALL" ? undefined : { type: query.type },
    );
    const counts = countMovementsByType(movements);

    return (
        <>
            <AppTopbar crumbs={[{ label: "Inventory", href: "/inventory" }, { label: "Movements" }]} />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Inventory"
                        title={
                            <>
                                Movements<em className="text-(--accent) italic">.</em>
                            </>
                        }
                        description="Immutable. Every receipt, issue, transfer, and adjustment lands here, and each post auto-records the matching journal entry."
                        actions={
                            <Button asChild variant="default" size="sm">
                                <Link href="/inventory/movements/new">
                                    <IconPlus stroke={1.8} />
                                    New movement
                                </Link>
                            </Button>
                        }
                    />

                    <Block
                        title="Ledger"
                        description={`${movements.length} movement${movements.length === 1 ? "" : "s"} in view.`}>
                        <div className="mb-5">
                            <MovementsToolbar activeType={query.type} counts={counts} />
                        </div>
                        <MovementsTable rows={movements} detailHrefBase="/inventory/movements" />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default MovementsListPage;
