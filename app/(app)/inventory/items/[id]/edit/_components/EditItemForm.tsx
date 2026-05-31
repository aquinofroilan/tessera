"use client";

import { ItemForm, type UomOption } from "../../../_components/ItemForm";
import type { ItemFormValues } from "../../../../_data/item-form-schema";
import { updateItemAction } from "../_data/update-item-action";

type EditItemFormProps = {
    itemId: string;
    defaultValues: ItemFormValues;
    lockValuationMethod: boolean;
    uomOptions: UomOption[];
};

export const EditItemForm = ({ itemId, defaultValues, lockValuationMethod, uomOptions }: EditItemFormProps) => (
    <ItemForm
        defaultValues={defaultValues}
        submitLabel="Save changes"
        lockValuationMethod={lockValuationMethod}
        uomOptions={uomOptions}
        action={(values) => updateItemAction(itemId, values)}
    />
);
