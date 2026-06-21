import type { Metadata } from "next";

import { listAssetCategories } from "@/lib/api/assets/assets-dal";
import { listAccounts } from "@/lib/api/finance/accounts-dal";
import { AppTopbar } from "../../_components/AppTopbar";
import { PageHeader } from "../../_components/PageHeader";
import { AssetForm } from "../_components/AssetForm";
import { ASSET_FORM_DEFAULTS } from "../_data/asset-form-schema";
import { createAssetAction } from "./_data/create-asset-action";

export const metadata: Metadata = {
    title: "New fixed asset · Tessera",
};

const NewAssetPage = async () => {
    const [categories, accounts] = await Promise.all([listAssetCategories(true), listAccounts()]);

    return (
        <>
            <AppTopbar
                crumbs={[
                    { label: "Assets", href: "/assets" },
                    { label: "New" },
                ]}
            />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-300 p-9">
                    <PageHeader
                        eyebrow="Fixed assets · New"
                        title="New fixed asset"
                        description="Acquisition cost, salvage, and useful life are immutable after creation — they drive depreciation."
                    />
                    <AssetForm
                        defaultValues={ASSET_FORM_DEFAULTS}
                        submitLabel="Create asset"
                        action={createAssetAction}
                        categories={categories.map((c) => ({ id: c.id, label: `${c.code} · ${c.name}` }))}
                        accounts={accounts.map((a) => ({ id: a.id, label: `${a.code} · ${a.name}` }))}
                    />
                </div>
            </div>
        </>
    );
};

export default NewAssetPage;
