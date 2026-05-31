"use client";

import { POSITION_FORM_DEFAULTS } from "../../../_data/position-form-schema";
import { PositionForm, type DepartmentOption } from "../../_components/PositionForm";
import { createPositionAction } from "../_data/create-position-action";

export const NewPositionForm = ({ departments }: { departments: DepartmentOption[] }) => (
    <PositionForm
        defaultValues={POSITION_FORM_DEFAULTS}
        submitLabel="Create position"
        departments={departments}
        action={createPositionAction}
    />
);
