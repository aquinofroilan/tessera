"use client";

import { ITEM_FORM_DEFAULTS } from "../../../_data/item-form-schema";
import { ItemForm, type UomOption } from "../../_components/ItemForm";
import { createItemAction } from "../_data/create-item-action";

export const NewItemForm = ({ uomOptions }: { uomOptions: UomOption[] }) => (
    <ItemForm
        defaultValues={ITEM_FORM_DEFAULTS}
        submitLabel="Create item"
        uomOptions={uomOptions}
        action={createItemAction}
    />
);
