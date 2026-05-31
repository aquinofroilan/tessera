import type { Metadata } from "next";

import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { NewWarehouseForm } from "./_components/NewWarehouseForm";

export const metadata: Metadata = {
    title: "New warehouse · Loom",
};

const NewWarehousePage = () => (
    <>
        <AppTopbar
            crumbs={[
                { label: "Inventory", href: "/inventory" },
                { label: "Warehouses", href: "/inventory/warehouses" },
                { label: "New" },
            ]}
        />
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-400 p-9">
                <PageHeader
                    eyebrow="Inventory · Warehouses · New"
                    title="New warehouse"
                    description="Add a physical or logical place where stock is held. Storage locations (bins or zones) are managed on the warehouse detail page."
                />
                <NewWarehouseForm />
            </div>
        </div>
    </>
);

export default NewWarehousePage;
