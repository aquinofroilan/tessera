"use client";

import { WAREHOUSE_FORM_DEFAULTS } from "../../../_data/warehouse-form-schema";
import { WarehouseForm } from "../../_components/WarehouseForm";
import { createWarehouseAction } from "../_data/create-warehouse-action";

export const NewWarehouseForm = () => (
    <WarehouseForm
        defaultValues={WAREHOUSE_FORM_DEFAULTS}
        submitLabel="Create warehouse"
        action={createWarehouseAction}
    />
);
