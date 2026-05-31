import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppTopbar } from "../../../../_components/AppTopbar";
import { PageHeader } from "../../../../_components/PageHeader";
import { getItem } from "@/lib/api/inventory/items-dal";
import { listUoms } from "@/lib/api/inventory/uoms-dal";
import type { ItemFormValues } from "../../../_data/item-form-schema";
import { EditItemForm } from "./_components/EditItemForm";

type Props = { params: Promise<{ id: string }> };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { id } = await params;
    const item = await getItem(id);
    return { title: item ? `Edit ${item.name} · Loom` : "Edit item · Loom" };
};

const toFormValues = (item: Awaited<ReturnType<typeof getItem>> & object): ItemFormValues => ({
    sku: item.sku,
    name: item.name,
    description: item.description ?? "",
    kind: item.kind,
    unitOfMeasure: item.unitOfMeasure,
    valuationMethod: item.valuationMethod,
    salesPrice: item.salesPrice ?? "",
    purchaseCost: item.purchaseCost ?? "",
    inventoryAccountId: item.inventoryAccountId ?? "",
    cogsAccountId: item.cogsAccountId ?? "",
    revenueAccountId: item.revenueAccountId ?? "",
    reorderPoint: item.reorderPoint != null ? String(item.reorderPoint) : "",
    reorderQuantity: item.reorderQuantity != null ? String(item.reorderQuantity) : "",
    currencyCode: item.currencyCode ?? "",
});

const EditItemPage = async ({ params }: Props) => {
    const { id } = await params;
    const item = await getItem(id);
    if (!item) notFound();
    const uoms = await listUoms();

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Inventory", href: "/inventory" },
                    { label: "Items", href: "/inventory/items" },
                    { label: item.name, href: `/inventory/items/${item.id}` },
                    { label: "Edit" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Inventory · Items · Edit"
                        title={`Edit ${item.name}`}
                        description={
                            item.hasMovements
                                ? "Valuation method is locked because movements have already posted."
                                : "Update identification, pricing, accounting, and reorder thresholds."
                        }
                    />
                    <EditItemForm
                        itemId={item.id}
                        defaultValues={toFormValues(item)}
                        lockValuationMethod={item.hasMovements}
                        uomOptions={uoms.map((u) => ({ code: u.code, name: u.name }))}
                    />
                </div>
            </div>
        </>
    );
};

export default EditItemPage;
