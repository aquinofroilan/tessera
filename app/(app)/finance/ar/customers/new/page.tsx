import type { Metadata } from "next";

import { AppTopbar } from "../../../../_components/AppTopbar";
import { PageHeader } from "../../../../_components/PageHeader";
import { NewCustomerForm } from "./_components/NewCustomerForm";

export const metadata: Metadata = {
    title: "New customer · Tessera",
};

const NewCustomerPage = () => {
    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Finance", href: "/finance" },
                    { label: "Receivables" },
                    { label: "Customers", href: "/finance/ar/customers" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · Receivables · New"
                        title="New customer"
                        description="Add who you bill — contact details, payment terms, and default revenue routing."
                    />
                    <NewCustomerForm />
                </div>
            </div>
        </>
    );
};

export default NewCustomerPage;
