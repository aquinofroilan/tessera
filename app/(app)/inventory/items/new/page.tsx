import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { NewItemForm } from "./_components/NewItemForm";

export const metadata: Metadata = {
    title: "New item · Loom",
};

const NewItemPage = () => (
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
                <NewItemForm />
            </div>
        </div>
    </>
);

export default NewItemPage;
