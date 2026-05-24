import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconPencil } from "@tabler/icons-react";

import { Button, Card } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { getItem } from "@/lib/api/inventory/items-dal";
import { formatMoney } from "../../../finance/_data/format";
import { formatQuantity, itemKindLabel } from "../../_data/format";
import { InventoryStatusBadge } from "../../_components/InventoryStatusBadge";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const item = await getItem(id);
    return { title: item ? `${item.name} · Loom` : "Item · Loom" };
};

type ProfileRow = { label: string; value: string };

const ProfileGrid = ({ rows }: { rows: ProfileRow[] }) => (
    <Card className="p-6">
        <dl className="grid gap-x-8 gap-y-4 md:grid-cols-2">
            {rows.map((row) => (
                <div key={row.label} className="flex flex-col gap-1">
                    <dt className="font-mono text-[10px] tracking-[0.12em] text-(--muted) uppercase">{row.label}</dt>
                    <dd className="text-[14px] text-(--ink)">{row.value}</dd>
                </div>
            ))}
        </dl>
    </Card>
);

const ComingSoonCard = ({ title, description }: { title: string; description: string }) => (
    <Card className="items-start gap-1 p-6">
        <div className="font-display text-[15px] font-[420] tracking-[-0.01em] text-(--ink)">{title}</div>
        <div className="text-[13px] text-(--muted)">{description}</div>
    </Card>
);

const ItemDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const item = await getItem(id);
    if (!item) notFound();

    const currency = item.currencyCode ?? "USD";
    const identification: ProfileRow[] = [
        { label: "SKU", value: item.sku },
        { label: "Kind", value: itemKindLabel(item.kind) },
        { label: "Unit", value: item.unitOfMeasure },
        { label: "Valuation", value: item.valuationMethod === "FIFO" ? "FIFO" : "Weighted average" },
        { label: "Sales price", value: item.salesPrice ? formatMoney(item.salesPrice, currency) : "—" },
        { label: "Purchase cost", value: item.purchaseCost ? formatMoney(item.purchaseCost, currency) : "—" },
    ];

    const accounting: ProfileRow[] = [
        { label: "Inventory account", value: item.inventoryAccountId ?? "—" },
        { label: "COGS account", value: item.cogsAccountId ?? "—" },
        { label: "Revenue account", value: item.revenueAccountId ?? "—" },
        {
            label: "Reorder point",
            value: item.reorderPoint != null ? `${item.reorderPoint} ${item.unitOfMeasure}` : "—",
        },
        {
            label: "Reorder quantity",
            value: item.reorderQuantity != null ? `${item.reorderQuantity} ${item.unitOfMeasure}` : "—",
        },
        { label: "Currency", value: item.currencyCode ?? "—" },
    ];

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Inventory", href: "/inventory" },
                    { label: "Items", href: "/inventory/items" },
                    { label: item.name },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Inventory · Items"
                        title={
                            <span className="flex items-center gap-3">
                                {item.name}
                                <InventoryStatusBadge status={item.status} />
                            </span>
                        }
                        description={
                            item.description ??
                            `${formatQuantity(item.onHand, item.unitOfMeasure)} on hand · ${formatMoney(item.onHandValue, currency)} carrying value`
                        }
                        actions={
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/inventory/items/${item.id}/edit`}>
                                    <IconPencil stroke={1.8} />
                                    Edit
                                </Link>
                            </Button>
                        }
                    />

                    <Block title="Profile" description="Identification, pricing, and valuation method.">
                        <ProfileGrid rows={identification} />
                    </Block>

                    <Block title="Accounting & reorder" description="GL account routing and low-stock thresholds.">
                        <ProfileGrid rows={accounting} />
                    </Block>

                    <Block title="Stock by location" description="On-hand quantity per warehouse.">
                        <ComingSoonCard
                            title="Coming with warehouses + movements"
                            description="Stock-by-location appears once warehouses and the movement ledger are wired."
                        />
                    </Block>

                    <Block title="Variants" description="Size, color, and other attribute splits.">
                        <ComingSoonCard
                            title="Coming with UoM & variants"
                            description="Variant management lands in a follow-up PR."
                        />
                    </Block>

                    <Block title="Recent movements" description="Receipts, issues, transfers, and adjustments.">
                        <ComingSoonCard
                            title="Coming with the movement ledger"
                            description="Movement history surfaces once the ledger PR lands."
                        />
                    </Block>
                </div>
            </div>
        </>
    );
};

export default ItemDetailPage;
