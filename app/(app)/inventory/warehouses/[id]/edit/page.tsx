import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppTopbar } from "../../../../_components/AppTopbar";
import { PageHeader } from "../../../../_components/PageHeader";
import { getWarehouse } from "@/lib/api/inventory/warehouses-dal";
import type { WarehouseFormValues } from "../../../_data/warehouse-form-schema";
import { EditWarehouseForm } from "./_components/EditWarehouseForm";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const warehouse = await getWarehouse(id);
    return { title: warehouse ? `Edit ${warehouse.name} · Loom` : "Edit warehouse · Loom" };
};

const toFormValues = (w: Awaited<ReturnType<typeof getWarehouse>> & object): WarehouseFormValues => ({
    code: w.code,
    name: w.name,
    address: w.address ?? "",
    allowNegativeStock: w.allowNegativeStock,
    isDefault: w.isDefault,
});

const EditWarehousePage = async ({ params }: Props) => {
    const { id } = await params;
    const warehouse = await getWarehouse(id);
    if (!warehouse) notFound();

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Inventory", href: "/inventory" },
                    { label: "Warehouses", href: "/inventory/warehouses" },
                    { label: warehouse.name, href: `/inventory/warehouses/${warehouse.id}` },
                    { label: "Edit" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Inventory · Warehouses · Edit"
                        title={`Edit ${warehouse.name}`}
                        description="Update identification, address, and per-warehouse policies."
                    />
                    <EditWarehouseForm warehouseId={warehouse.id} defaultValues={toFormValues(warehouse)} />
                </div>
            </div>
        </>
    );
};

export default EditWarehousePage;
