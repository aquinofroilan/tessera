import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconPencil } from "@tabler/icons-react";

import { Button, Card } from "@/components/ui";
import { AppTopbar } from "../../../_components/AppTopbar";
import { Block } from "../../../_components/Block";
import { PageHeader } from "../../../_components/PageHeader";
import { getWarehouse } from "@/lib/api/inventory/warehouses-dal";
import { listStorageLocations } from "@/lib/api/inventory/storage-locations-dal";
import { StorageLocationsTable } from "../../_components/StorageLocationsTable";
import { AddStorageLocationForm } from "./_components/AddStorageLocationForm";
import { WarehouseArchiveButton } from "./_components/WarehouseArchiveButton";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const warehouse = await getWarehouse(id);
    return { title: warehouse ? `${warehouse.name} · Tessera` : "Warehouse · Tessera" };
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

const WarehouseDetailPage = async ({ params }: Props) => {
    const { id } = await params;
    const warehouse = await getWarehouse(id);
    if (!warehouse) notFound();

    const locations = await listStorageLocations(id);

    const profile: ProfileRow[] = [
        { label: "Code", value: warehouse.code },
        { label: "Address", value: warehouse.address ?? "—" },
        { label: "Negative stock", value: warehouse.allowNegativeStock ? "Allowed" : "Blocked" },
        { label: "Default", value: warehouse.isDefault ? "Yes" : "No" },
        { label: "Storage locations", value: String(warehouse.storageLocationCount) },
        { label: "Status", value: warehouse.isActive ? "Active" : "Archived" },
    ];

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Inventory", href: "/inventory" },
                    { label: "Warehouses", href: "/inventory/warehouses" },
                    { label: warehouse.name },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Inventory · Warehouses"
                        title={warehouse.name}
                        description={
                            warehouse.address ??
                            `${warehouse.storageLocationCount} storage location${warehouse.storageLocationCount === 1 ? "" : "s"}.`
                        }
                        actions={
                            <>
                                <WarehouseArchiveButton warehouseId={warehouse.id} isActive={warehouse.isActive} />
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/inventory/warehouses/${warehouse.id}/edit`}>
                                        <IconPencil stroke={1.8} />
                                        Edit
                                    </Link>
                                </Button>
                            </>
                        }
                    />

                    <Block title="Profile" description="Warehouse identification and policies.">
                        <ProfileGrid rows={profile} />
                    </Block>

                    <Block
                        title="Storage locations"
                        description="Bins, zones, or shelves that subdivide this warehouse.">
                        <div className="grid gap-4">
                            <StorageLocationsTable rows={locations} />
                            <AddStorageLocationForm
                                warehouseId={warehouse.id}
                                parents={locations.filter((l) => l.isActive)}
                            />
                        </div>
                    </Block>
                </div>
            </div>
        </>
    );
};

export default WarehouseDetailPage;
