"use client";

import { WarehouseForm } from "../../../_components/WarehouseForm";
import type { WarehouseFormValues } from "../../../../_data/warehouse-form-schema";
import { updateWarehouseAction } from "../_data/update-warehouse-action";

type EditWarehouseFormProps = {
    warehouseId: string;
    defaultValues: WarehouseFormValues;
};

export const EditWarehouseForm = ({ warehouseId, defaultValues }: EditWarehouseFormProps) => (
    <WarehouseForm
        defaultValues={defaultValues}
        submitLabel="Save changes"
        action={(values) => updateWarehouseAction(warehouseId, values)}
    />
);
