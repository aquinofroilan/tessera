import type { Metadata } from "next";

import { AppTopbar } from "../../../../_components/AppTopbar";
import { PageHeader } from "../../../../_components/PageHeader";
import { NewInvoiceForm } from "./_components/NewInvoiceForm";

export const metadata: Metadata = {
    title: "New invoice · Loom",
};

export default function NewInvoicePage() {
    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Finance", href: "/finance" },
                    { label: "Receivables" },
                    { label: "Invoices", href: "/finance/ar/invoices" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · Receivables · New"
                        title="New invoice"
                        description="Capture lines now and keep it as a draft, or approve once the lines are right."
                    />
                    <NewInvoiceForm />
                </div>
            </div>
        </>
    );
}
