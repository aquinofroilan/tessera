import type { Metadata } from "next";

import { AppTopbar } from "../../../../_components/AppTopbar";
import { PageHeader } from "../../../../_components/PageHeader";
import { NewBillForm } from "./_components/NewBillForm";

export const metadata: Metadata = {
    title: "New bill · Tessera",
};

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewBillPage({ searchParams }: Props) {
    const sp = await searchParams;
    const vendorId = Array.isArray(sp.vendorId) ? sp.vendorId[0] : sp.vendorId;
    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Finance", href: "/finance" },
                    { label: "Payables" },
                    { label: "Bills", href: "/finance/ap/bills" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-400 p-9">
                    <PageHeader
                        eyebrow="Finance · Payables · New"
                        title="New bill"
                        description="Capture lines now and keep it as a draft, or approve once the lines are right."
                    />
                    <NewBillForm initialVendorId={vendorId} />
                </div>
            </div>
        </>
    );
}
