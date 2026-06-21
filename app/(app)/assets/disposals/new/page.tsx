import type { Metadata } from "next";

import { listAssets } from "@/lib/api/assets/assets-dal";
import { listAccounts } from "@/lib/api/finance/accounts-dal";
import { AppTopbar } from "../../../_components/AppTopbar";
import { PageHeader } from "../../../_components/PageHeader";
import { DisposalForm } from "../_components/DisposalForm";

export const metadata: Metadata = {
    title: "New asset disposal · Tessera",
};

const NewDisposalPage = async () => {
    const [assets, accounts] = await Promise.all([listAssets({ status: "ACTIVE" }), listAccounts()]);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Assets", href: "/assets" },
                    { label: "Disposals", href: "/assets/disposals" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow="Fixed assets · New disposal"
                        title="New disposal"
                        description="Only ACTIVE assets can be disposed. Sale records proceeds; write-off or scrap typically have zero proceeds."
                    />
                    <DisposalForm
                        assets={assets.map((a) => ({ id: a.id, label: `${a.assetNumber} · ${a.name}` }))}
                        accounts={accounts.map((a) => ({ id: a.id, label: `${a.code} · ${a.name}` }))}
                    />
                </div>
            </div>
        </>
    );
};

export default NewDisposalPage;
