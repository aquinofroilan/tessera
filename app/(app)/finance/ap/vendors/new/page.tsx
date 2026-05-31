import type { Metadata } from "next";

import { AppTopbar } from "../../../../_components/AppTopbar";
import { PageHeader } from "../../../../_components/PageHeader";
import { NewVendorForm } from "./_components/NewVendorForm";

export const metadata: Metadata = {
    title: "New vendor · Tessera",
};

const NewVendorPage = () => {
    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Finance", href: "/finance" },
                    { label: "Payables" },
                    { label: "Vendors", href: "/finance/ap/vendors" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · Payables · New"
                        title="New vendor"
                        description="Add who bills you — contact details, payment terms, and default expense routing."
                    />
                    <NewVendorForm />
                </div>
            </div>
        </>
    );
};

export default NewVendorPage;
