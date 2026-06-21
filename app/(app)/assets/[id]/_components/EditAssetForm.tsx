"use client";

import { AssetForm } from "../../_components/AssetForm";
import type { AssetFormValues } from "../../_data/asset-form-schema";
import { updateAssetAction } from "../_data/update-asset-action";

type Option = { id: string; label: string };

type Props = {
    id: string;
    defaultValues: AssetFormValues;
    categories: Option[];
    accounts: Option[];
};

export function EditAssetForm({ id, defaultValues, categories, accounts }: Props) {
    return (
        <AssetForm
            defaultValues={defaultValues}
            submitLabel="Save changes"
            action={(values) => updateAssetAction(id, values)}
            categories={categories}
            accounts={accounts}
            editMode
        />
    );
}
