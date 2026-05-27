"use client";

import { ItemForm } from "../../../_components/ItemForm";
import type { ItemFormValues } from "../../../../_data/item-form-schema";
import { updateItemAction } from "../_data/update-item-action";

type EditItemFormProps = {
    itemId: string;
    defaultValues: ItemFormValues;
    lockValuationMethod: boolean;
};

export const EditItemForm = ({ itemId, defaultValues, lockValuationMethod }: EditItemFormProps) => (
    <ItemForm
        defaultValues={defaultValues}
        submitLabel="Save changes"
        lockValuationMethod={lockValuationMethod}
        action={(values) => updateItemAction(itemId, values)}
    />
);
