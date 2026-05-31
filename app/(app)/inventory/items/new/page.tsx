import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { listUoms } from "@/lib/api/inventory/uoms-dal";
import { NewItemForm } from "./_components/NewItemForm";

export const metadata: Metadata = {
    title: "New item · Loom",
};

const NewItemPage = async () => {
    const uoms = await listUoms();
    return (
    <>
        <AppTopbar
            crumbs={[
                { label: "Inventory", href: "/inventory" },
                { label: "Items", href: "/inventory/items" },
                { label: "New" },
            ]}
        />
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-400 p-9">
                <PageHeader
                    eyebrow="Inventory · Items · New"
                    title="New item"
                    description="Add a product, service, or non-stock SKU. Stock items are tracked through movements; services and non-stock skip valuation."
                />
                <NewItemForm uomOptions={uoms.map((u) => ({ code: u.code, name: u.name }))} />
            </div>
        </div>
    </>
    );
};

export default NewItemPage;
