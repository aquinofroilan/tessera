import type { Metadata } from "next";

import { listVendors } from "@/lib/api/finance/vendors-dal";
import { listItems } from "@/lib/api/inventory/items-dal";
import { listWarehouses } from "@/lib/api/inventory/warehouses-dal";
import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { NewPurchaseRequestForm } from "./_components/NewPurchaseRequestForm";

export const metadata: Metadata = {
    title: "New purchase request · Tessera",
};

const NewPurchaseRequestPage = async () => {
    const [products, vendors, warehouses] = await Promise.all([
        listItems(),
        listVendors(),
        listWarehouses(),
    ]);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Procurement", href: "/procurement" },
                    { label: "Purchase requests", href: "/procurement/purchase-requests" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Procurement · New"
                        title="New purchase request"
                        description="Start in draft; submit when ready. Approval converts it to a PO."
                    />
                    <NewPurchaseRequestForm
                        products={products.map((p) => ({ id: p.id, label: `${p.sku} · ${p.name}` }))}
                        vendors={vendors.map((v) => ({ id: v.id, label: v.name }))}
                        warehouses={warehouses.map((w) => ({ id: w.id, label: `${w.code} · ${w.name}` }))}
                    />
                </div>
            </div>
        </>
    );
};

export default NewPurchaseRequestPage;
